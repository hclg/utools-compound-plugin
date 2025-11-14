// 复利计算相关类型定义

// 复利频率类型
export type CompoundFrequency = 'yearly' | 'semi-annually' | 'quarterly' | 'monthly';

// 投资期限单位
export type PeriodUnit = 'year' | 'month';

// 追加投资频率
export type AdditionalInvestmentFrequency = 'yearly' | 'monthly';

// 计算参数
export interface CalculationParams {
  principal: number; // 本金
  annualRate: number; // 年利率（百分比）
  period: number; // 投资期限
  periodUnit: PeriodUnit; // 期限单位
  frequency: CompoundFrequency; // 复利频率
  additionalInvestment: number; // 定期追加投资金额
  additionalInvestmentFrequency: AdditionalInvestmentFrequency; // 追加投资频率
}

// 年度收益明细
export interface YearlyDetail {
  year: number; // 年份
  beginningBalance: number; // 期初余额
  interest: number; // 利息收入
  additionalInvestment: number; // 追加投资
  endingBalance: number; // 期末余额
}

// 计算结果
export interface CalculationResult {
  finalAmount: number; // 最终金额
  totalInterest: number; // 总利息
  totalInvestment: number; // 总投资额
  returnRate: number; // 收益率（百分比）
  yearlyDetails: YearlyDetail[]; // 年度明细
}

// 预设利率选项
export interface PresetRate {
  label: string;
  value: number;
}
