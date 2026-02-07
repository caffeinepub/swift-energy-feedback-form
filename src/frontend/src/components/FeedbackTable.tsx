import { useGetAllFeedback } from '../hooks/useQueries';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { ScrollArea } from './ui/scroll-area';
import { Loader2, MessageSquare } from 'lucide-react';
import { SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';

export default function FeedbackTable() {
  const { data: feedback, isLoading, error } = useGetAllFeedback();
  const { t } = useLanguage();

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <SheetHeader className="mb-4 sm:mb-6">
        <SheetTitle className="text-xl sm:text-2xl flex items-center gap-2">
          <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6" />
          {t('allFeedback')}
        </SheetTitle>
        <SheetDescription className="text-xs sm:text-sm">
          {t('feedbackDescription')}
        </SheetDescription>
      </SheetHeader>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {error && (
        <div className="text-center py-12 text-destructive text-sm">
          {t('errorLoadFeedback')}
        </div>
      )}

      {!isLoading && !error && feedback && feedback.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-sm">
          {t('noFeedback')}
        </div>
      )}

      {!isLoading && !error && feedback && feedback.length > 0 && (
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <ScrollArea className="h-[calc(100vh-180px)] sm:h-[calc(100vh-200px)]">
            <div className="min-w-[800px] px-4 sm:px-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold text-xs sm:text-sm">{t('tableHeaderName')}</TableHead>
                    <TableHead className="font-bold text-xs sm:text-sm">{t('tableHeaderAge')}</TableHead>
                    <TableHead className="font-bold text-xs sm:text-sm">{t('tableHeaderCountry')}</TableHead>
                    <TableHead className="font-bold text-xs sm:text-sm">{t('tableHeaderTeam')}</TableHead>
                    <TableHead className="font-bold text-xs sm:text-sm">{t('tableHeaderThoughts')}</TableHead>
                    <TableHead className="font-bold text-xs sm:text-sm">{t('tableHeaderFeelings')}</TableHead>
                    <TableHead className="font-bold text-xs sm:text-sm">{t('tableHeaderDate')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedback.map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium text-xs sm:text-sm">{entry.name}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{entry.age.toString()}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{entry.country}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{entry.team}</TableCell>
                      <TableCell className="max-w-[200px] sm:max-w-xs">
                        <div className="line-clamp-3 text-xs sm:text-sm">{entry.thoughts}</div>
                      </TableCell>
                      <TableCell className="max-w-[200px] sm:max-w-xs">
                        <div className="line-clamp-3 text-xs sm:text-sm">{entry.feelings}</div>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                        {formatDate(entry.timestamp)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
        </div>
      )}
    </>
  );
}
