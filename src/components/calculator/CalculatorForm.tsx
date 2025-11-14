import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { saveCalculation, type CalculationRecord } from '@/utils/history';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { History } from 'lucide-react';
import HistoryPanel from './HistoryPanel';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { CalculationParams, PresetRate } from '@/types/compound-interest';
import { Calculator, RotateCcw } from 'lucide-react';

// 预设利率选项
const presetRates: PresetRate[] = [
  { label: '活期存款 0.35%', value: 0.35 },
  { label: '定期1年 1.5%', value: 1.5 },
  { label: '定期3年 2.75%', value: 2.75 },
  { label: '理财产品 3.5%', value: 3.5 },
  { label: '基金投资 6%', value: 6 },
  { label: '股票投资 8%', value: 8 },
];

// 表单验证规则
const formSchema = z.object({
  principal: z
    .number({ invalid_type_error: '请输入有效的数字' })
    .min(0.01, '本金必须大于0')
    .max(1000000000, '本金不能超过10亿'),
  annualRate: z
    .number({ invalid_type_error: '请输入有效的数字' })
    .min(0, '年利率不能为负')
    .max(100, '年利率不能超过100%'),
  period: z
    .number({ invalid_type_error: '请输入有效的数字' })
    .min(1, '投资期限至少为1')
    .max(100, '投资期限不能超过100'),
  periodUnit: z.enum(['year', 'month']),
  frequency: z.enum(['yearly', 'semi-annually', 'quarterly', 'monthly']),
  additionalInvestment: z
    .number({ invalid_type_error: '请输入有效的数字' })
    .min(0, '追加投资不能为负')
    .max(100000000, '追加投资不能超过1亿'),
  additionalInvestmentFrequency: z.enum(['yearly', 'monthly']),
});

type FormValues = z.infer<typeof formSchema>;

interface CalculatorFormProps {
  onCalculate: (params: CalculationParams) => {
    finalAmount: number;
    totalInterest: number;
  };
}

export default function CalculatorForm({ onCalculate }: CalculatorFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      principal: 100000,
      annualRate: 3.5,
      period: 10,
      periodUnit: 'year',
      frequency: 'yearly',
      additionalInvestment: 0,
      additionalInvestmentFrequency: 'monthly',
    },
  });

  const [showHistory, setShowHistory] = useState(false);

  const onSubmit = async (values: FormValues) => {
    const params = values as CalculationParams;
    const result = onCalculate(params);
    
    // 保存完整计算记录
    saveCalculation({
      params: {
        principal: params.principal,
        rate: params.annualRate,
        years: params.periodUnit === 'year' ? params.period : params.period / 12,
        monthlyInvestment: params.additionalInvestmentFrequency === 'monthly' 
          ? params.additionalInvestment 
          : params.additionalInvestment / 12,
        compoundFrequency: params.frequency === 'yearly' ? 1 
          : params.frequency === 'semi-annually' ? 2
          : params.frequency === 'quarterly' ? 4
          : 12
      },
      result
    });
  };

  const handleSelectHistory = (record: CalculationRecord) => {
    form.setValue('principal', record.params.principal);
    form.setValue('annualRate', record.params.rate);
    form.setValue('period', record.params.years);
    form.setValue('periodUnit', 'year');
    form.setValue(
      'frequency', 
      record.params.compoundFrequency === 1 ? 'yearly'
        : record.params.compoundFrequency === 2 ? 'semi-annually'
        : record.params.compoundFrequency === 4 ? 'quarterly'
        : 'monthly'
    );
    form.setValue('additionalInvestment', record.params.monthlyInvestment || 0);
    form.setValue('additionalInvestmentFrequency', 'monthly');
    setShowHistory(false);
  };

  const handleReset = () => {
    form.reset();
  };

  const handlePresetRate = (rate: number) => {
    form.setValue('annualRate', rate);
  };

  return (
    <Card className="shadow-elegant">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Calculator className="h-5 w-5" />
          计算参数
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="principal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>本金（元）</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="请输入初始投资金额"
                      {...field}
                      onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                      className="focus-visible:ring-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="annualRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>年利率（%）</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="请输入年利率"
                      {...field}
                      onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                      className="focus-visible:ring-primary"
                    />
                  </FormControl>
                  <FormMessage />
                  <div className="mt-2 flex flex-wrap gap-2">
                    {presetRates.map((preset) => (
                      <Button
                        key={preset.value}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handlePresetRate(preset.value)}
                        className="text-xs hover:bg-primary hover:text-primary-foreground"
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="period"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>投资期限</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="期限"
                        {...field}
                        onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                        className="focus-visible:ring-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="periodUnit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>单位</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="focus:ring-primary">
                          <SelectValue placeholder="选择单位" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="year">年</SelectItem>
                        <SelectItem value="month">月</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>复利频率</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="focus:ring-primary">
                        <SelectValue placeholder="选择复利频率" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="yearly">年复利</SelectItem>
                      <SelectItem value="semi-annually">半年复利</SelectItem>
                      <SelectItem value="quarterly">季度复利</SelectItem>
                      <SelectItem value="monthly">月复利</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="additionalInvestment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>定期追加投资（元）</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="追加金额"
                        {...field}
                        onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                        className="focus-visible:ring-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="additionalInvestmentFrequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>追加频率</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="focus:ring-primary">
                          <SelectValue placeholder="选择频率" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="monthly">每月</SelectItem>
                        <SelectItem value="yearly">每年</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="flex-1 bg-gradient-primary hover:opacity-90">
                <Calculator className="mr-2 h-4 w-4" />
                开始计算
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="hover:bg-destructive hover:text-destructive-foreground"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Dialog open={showHistory} onOpenChange={setShowHistory}>
                <DialogTrigger asChild>
                  <Button type="button" variant="outline">
                    <History className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>计算历史</DialogTitle>
                  </DialogHeader>
                  <HistoryPanel onSelectRecord={handleSelectHistory} />
                </DialogContent>
              </Dialog>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
