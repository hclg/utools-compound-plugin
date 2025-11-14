import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { CalculationResult } from '@/types/compound-interest';
import { formatCurrency, formatPercentage } from '@/utils/compound-interest';
import { TrendingUp, Wallet, PiggyBank, Percent } from 'lucide-react';

interface ResultSummaryProps {
  result: CalculationResult;
}

export default function ResultSummary({ result }: ResultSummaryProps) {
  const summaryItems = [
    {
      label: '最终金额',
      value: formatCurrency(result.finalAmount),
      icon: Wallet,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: '总利息',
      value: formatCurrency(result.totalInterest),
      icon: TrendingUp,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      label: '总投资额',
      value: formatCurrency(result.totalInvestment),
      icon: PiggyBank,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: '收益率',
      value: formatPercentage(result.returnRate),
      icon: Percent,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
  ];

  return (
    <Card className="shadow-elegant">
      <CardHeader>
        <CardTitle className="text-primary">计算结果</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {summaryItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-all hover:shadow-md"
              >
                <div className={`rounded-full p-3 ${item.bgColor}`}>
                  <Icon className={`h-6 w-6 ${item.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
