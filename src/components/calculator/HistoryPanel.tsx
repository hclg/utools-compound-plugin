import { getHistory, clearHistory, type CalculationRecord } from '@/utils/history';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface HistoryPanelProps {
  onSelectRecord?: (record: CalculationRecord) => void;
}

export default function HistoryPanel({ onSelectRecord }: HistoryPanelProps) {
  const history = getHistory();

  const handleClearHistory = () => {
    if (window.confirm('确定要清空所有历史记录吗？此操作不可撤销。')) {
      clearHistory();
      window.location.reload(); // 重新加载以更新UI
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY'
    }).format(amount);
  };

  if (history.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">暂无计算历史记录</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <CardTitle className="text-lg">历史记录 ({history.length})</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearHistory}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          清空历史
        </Button>
      </div>
      
      <ScrollArea className="h-96">
        <div className="space-y-3">
          {history.map((record) => (
            <Card key={record.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div 
                  className="space-y-2"
                  onClick={() => onSelectRecord?.(record)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(record.timestamp), 'yyyy年MM月dd日 HH:mm', { locale: zhCN })}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">本金：</span>
                      <DollarSign className="inline h-3 w-3 mr-1" />
                      {formatAmount(record.params.principal)}
                    </div>
                    <div>
                      <span className="text-muted-foreground">利率：</span>
                      {record.params.rate}%
                    </div>
                    <div>
                      <span className="text-muted-foreground">期限：</span>
                      {record.params.years}年
                    </div>
                    <div>
                      <span className="text-muted-foreground">定投：</span>
                      <DollarSign className="inline h-3 w-3 mr-1" />
                      {formatAmount(record.params.monthlyInvestment || 0)}/月
                    </div>
                  </div>
                  
                  {record.result.finalAmount > 0 && (
                    <div className="flex items-center space-x-1 text-green-600 font-medium">
                      <TrendingUp className="h-4 w-4" />
                      <span>最终金额：{formatAmount(record.result.finalAmount)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}