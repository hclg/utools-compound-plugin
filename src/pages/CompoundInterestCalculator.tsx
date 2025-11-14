import { useState } from 'react';
import { Button } from '@/components/ui/button';
import CalculatorForm from '@/components/calculator/CalculatorForm';
import ResultSummary from '@/components/calculator/ResultSummary';
import YearlyDetailsTable from '@/components/calculator/YearlyDetailsTable';
import GrowthChart from '@/components/calculator/GrowthChart';
import type { CalculationParams, CalculationResult } from '@/types/compound-interest';
import { calculateCompoundInterest, exportToCSV, downloadCSV } from '@/utils/compound-interest';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

export default function CompoundInterestCalculator() {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [params, setParams] = useState<CalculationParams | null>(null);

  const handleCalculate = (calculationParams: CalculationParams) => {
    try {
      const calculationResult = calculateCompoundInterest(calculationParams);
      setResult(calculationResult);
      setParams(calculationParams);
      toast.success('计算完成！');
      return calculationResult;
    } catch (error) {
      toast.error('计算失败，请检查输入参数');
      console.error('计算错误:', error);
      return {
        finalAmount: 0,
        totalInterest: 0,
        yearlyDetails: []
      };
    }
  };

  const handleExport = () => {
    if (!result || !params) {
      toast.error('请先进行计算');
      return;
    }

    try {
      const csvContent = exportToCSV(result, params);
      downloadCSV(csvContent);
      toast.success('导出成功！');
    } catch (error) {
      toast.error('导出失败，请重试');
      console.error('导出错误:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-primary">复利计算器</h1>
          <p className="text-muted-foreground">
            在线复利计算工具，帮助您快速计算投资收益和复利增长效果
          </p>
        </div>

        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* 左侧：参数输入表单 */}
          <div className="xl:col-span-1">
            <CalculatorForm onCalculate={handleCalculate} />
          </div>

          {/* 右侧：结果展示区域 */}
          <div className="space-y-6 xl:col-span-2">
            {result ? (
              <>
                {/* 结果汇总 */}
                <ResultSummary result={result} />

                {/* 导出按钮 */}
                <div className="flex justify-end">
                  <Button
                    onClick={handleExport}
                    variant="outline"
                    className="hover:bg-primary hover:text-primary-foreground"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    导出为 CSV
                  </Button>
                </div>

                {/* 收益趋势图表 */}
                <GrowthChart details={result.yearlyDetails} />

                {/* 年度明细表格 */}
                <YearlyDetailsTable details={result.yearlyDetails} />
              </>
            ) : (
              <Card className="shadow-elegant">
                <CardContent className="flex h-[400px] items-center justify-center">
                  <div className="text-center">
                    <div className="mb-4 flex justify-center">
                      <div className="rounded-full bg-primary/10 p-6">
                        <Calculator className="h-12 w-12 text-primary" />
                      </div>
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-foreground">
                      开始计算您的投资收益
                    </h3>
                    <p className="text-muted-foreground">
                      请在左侧填写计算参数，点击"开始计算"按钮查看结果
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* 页脚说明 */}
        <div className="mt-12 rounded-lg border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-3 text-lg font-semibold text-primary">使用说明</h3>
          <div className="grid grid-cols-1 gap-4 text-sm text-muted-foreground md:grid-cols-2">
            <div>
              <h4 className="mb-2 font-medium text-foreground">复利频率说明：</h4>
              <ul className="list-inside list-disc space-y-1">
                <li>年复利：每年计算一次利息</li>
                <li>半年复利：每半年计算一次利息</li>
                <li>季度复利：每季度计算一次利息</li>
                <li>月复利：每月计算一次利息</li>
              </ul>
              <h4 className="mb-2 mt-4 font-medium text-foreground">追加投资频率：</h4>
              <ul className="list-inside list-disc space-y-1">
                <li>每月：每月定期追加投资（月定投）</li>
                <li>每年：每年定期追加投资（年定投）</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 font-medium text-foreground">计算公式：</h4>
              <p className="mb-2">复利计算公式：A = P(1 + r/n)^(nt)</p>
              <ul className="list-inside list-disc space-y-1">
                <li>A：最终金额</li>
                <li>P：本金</li>
                <li>r：年利率</li>
                <li>n：每年复利次数</li>
                <li>t：投资年数</li>
              </ul>
              <p className="mt-2 text-xs text-muted-foreground">
                注：月定投时，年度追加投资 = 月追加金额 × 12
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 导入Card组件
import { Card, CardContent } from '@/components/ui/card';
import { Calculator } from 'lucide-react';
