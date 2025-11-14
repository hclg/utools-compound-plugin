import type {
  CalculationParams,
  CalculationResult,
  CompoundFrequency,
  YearlyDetail,
} from '@/types/compound-interest';

// 获取复利频率对应的年复利次数
function getCompoundFrequencyPerYear(frequency: CompoundFrequency): number {
  const frequencyMap: Record<CompoundFrequency, number> = {
    yearly: 1,
    'semi-annually': 2,
    quarterly: 4,
    monthly: 12,
  };
  return frequencyMap[frequency];
}

// 计算复利
export function calculateCompoundInterest(params: CalculationParams): CalculationResult {
  const {
    principal,
    annualRate,
    period,
    periodUnit,
    frequency,
    additionalInvestment,
    additionalInvestmentFrequency,
  } = params;

  // 转换为年数
  const years = periodUnit === 'year' ? period : period / 12;

  // 年利率转换为小数
  const rate = annualRate / 100;

  // 每年复利次数
  const n = getCompoundFrequencyPerYear(frequency);

  // 计算年度明细
  const yearlyDetails: YearlyDetail[] = [];
  let currentBalance = principal;
  let totalAdditionalInvestment = 0;

  for (let year = 1; year <= Math.ceil(years); year++) {
    const beginningBalance = currentBalance;

    // 计算实际投资时间（最后一年可能不足一年）
    const actualYears = year <= years ? 1 : years - (year - 1);

    // 计算本年度利息
    // 使用复利公式: A = P(1 + r/n)^(nt)
    const endBalanceWithoutAdditional =
      beginningBalance * Math.pow(1 + rate / n, n * actualYears);
    const interest = endBalanceWithoutAdditional - beginningBalance;

    // 计算追加投资
    // 如果是月追加，则年追加金额 = 月追加金额 × 12
    // 如果是年追加，则直接使用年追加金额
    let actualAdditionalInvestment = 0;
    if (additionalInvestmentFrequency === 'monthly') {
      // 月追加定投：每月追加，一年12次
      actualAdditionalInvestment =
        year <= years ? additionalInvestment * 12 : additionalInvestment * 12 * (years - (year - 1));
    } else {
      // 年追加定投：每年追加一次
      actualAdditionalInvestment =
        year <= years ? additionalInvestment : additionalInvestment * (years - (year - 1));
    }

    totalAdditionalInvestment += actualAdditionalInvestment;

    // 期末余额
    const endingBalance = endBalanceWithoutAdditional + actualAdditionalInvestment;

    yearlyDetails.push({
      year,
      beginningBalance,
      interest,
      additionalInvestment: actualAdditionalInvestment,
      endingBalance,
    });

    currentBalance = endingBalance;

    // 如果已经超过投资期限，停止计算
    if (year >= years) break;
  }

  // 计算总投资额和总利息
  const totalInvestment = principal + totalAdditionalInvestment;
  const finalAmount = yearlyDetails[yearlyDetails.length - 1]?.endingBalance || 0;
  const totalInterest = finalAmount - totalInvestment;

  // 计算收益率
  const returnRate = totalInvestment > 0 ? (totalInterest / totalInvestment) * 100 : 0;

  return {
    finalAmount,
    totalInterest,
    totalInvestment,
    returnRate,
    yearlyDetails,
  };
}

// 格式化货币
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

// 格式化百分比
export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
}

// 导出为CSV
export function exportToCSV(result: CalculationResult, params: CalculationParams): string {
  const headers = ['年份', '期初余额', '利息收入', '追加投资', '期末余额'];
  const rows = result.yearlyDetails.map((detail) => [
    detail.year,
    detail.beginningBalance.toFixed(2),
    detail.interest.toFixed(2),
    detail.additionalInvestment.toFixed(2),
    detail.endingBalance.toFixed(2),
  ]);

  // 添加汇总信息
  const additionalInvestmentLabel =
    params.additionalInvestmentFrequency === 'monthly'
      ? `${params.additionalInvestment.toFixed(2)}（每月）`
      : `${params.additionalInvestment.toFixed(2)}（每年）`;

  const summary = [
    [],
    ['汇总信息'],
    ['本金', params.principal.toFixed(2)],
    ['年利率', `${params.annualRate}%`],
    ['投资期限', `${params.period}${params.periodUnit === 'year' ? '年' : '月'}`],
    ['定期追加投资', additionalInvestmentLabel],
    ['总投资额', result.totalInvestment.toFixed(2)],
    ['最终金额', result.finalAmount.toFixed(2)],
    ['总利息', result.totalInterest.toFixed(2)],
    ['收益率', `${result.returnRate.toFixed(2)}%`],
  ];

  const csvContent = [headers, ...rows, ...summary].map((row) => row.join(',')).join('\n');

  return csvContent;
}

// 下载CSV文件
export function downloadCSV(csvContent: string, filename = '复利计算结果.csv'): void {
  // 添加BOM以支持中文
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
