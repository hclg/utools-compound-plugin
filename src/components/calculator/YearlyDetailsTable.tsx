import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { YearlyDetail } from '@/types/compound-interest';
import { formatCurrency } from '@/utils/compound-interest';
import { FileText } from 'lucide-react';

interface YearlyDetailsTableProps {
  details: YearlyDetail[];
}

export default function YearlyDetailsTable({ details }: YearlyDetailsTableProps) {
  return (
    <Card className="shadow-elegant">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <FileText className="h-5 w-5" />
          年度收益明细
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full rounded-md border">
          <Table>
            <TableHeader className="sticky top-0 bg-muted">
              <TableRow>
                <TableHead className="text-center font-semibold">年份</TableHead>
                <TableHead className="text-right font-semibold">期初余额</TableHead>
                <TableHead className="text-right font-semibold">利息收入</TableHead>
                <TableHead className="text-right font-semibold">追加投资</TableHead>
                <TableHead className="text-right font-semibold">期末余额</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {details.map((detail) => (
                <TableRow key={detail.year} className="hover:bg-muted/50">
                  <TableCell className="text-center font-medium">第 {detail.year} 年</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(detail.beginningBalance)}
                  </TableCell>
                  <TableCell className="text-right text-success">
                    {formatCurrency(detail.interest)}
                  </TableCell>
                  <TableCell className="text-right text-primary">
                    {formatCurrency(detail.additionalInvestment)}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(detail.endingBalance)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
