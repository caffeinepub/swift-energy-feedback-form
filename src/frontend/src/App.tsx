import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FeedbackForm from './components/FeedbackForm';
import FeedbackTable from './components/FeedbackTable';
import PinDialog from './components/PinDialog';
import LanguageSelector from './components/LanguageSelector';
import { Button } from './components/ui/button';
import { Sheet, SheetContent } from './components/ui/sheet';
import { MessageSquare, ExternalLink } from 'lucide-react';
import { Toaster } from './components/ui/sonner';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

const queryClient = new QueryClient();

function AppContent() {
  const [isTableOpen, setIsTableOpen] = useState(false);
  const [isPinDialogOpen, setIsPinDialogOpen] = useState(false);
  const { t } = useLanguage();

  const handleViewFeedbackClick = () => {
    setIsPinDialogOpen(true);
  };

  const handlePinSuccess = () => {
    setIsPinDialogOpen(false);
    setIsTableOpen(true);
  };

  const handleWebsiteClick = () => {
    window.open('https://swiftenergy-gk5.caffeine.xyz/', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="fixed top-2 left-2 sm:top-4 sm:left-4 z-50">
        <LanguageSelector />
      </div>

      <div className="fixed top-2 right-2 sm:top-4 sm:right-4 z-50">
        <Button
          onClick={handleWebsiteClick}
          variant="default"
          size="sm"
          className="shadow-md hover:shadow-lg transition-all text-xs sm:text-sm"
        >
          <span className="hidden xs:inline">{t('websiteButton')}</span>
          <span className="xs:hidden">{t('websiteButtonShort')}</span>
          <ExternalLink className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>

      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-6 sm:mb-8 md:mb-12">
            <div className="flex justify-center mb-4 sm:mb-6">
              <img
                src="/assets/swift.jpeg"
                alt="Swift Energy Logo"
                className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-64 lg:h-64 object-contain"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-2 px-2">
              {t('title')}
            </h1>
            <p className="text-slate-600 text-sm sm:text-base md:text-lg px-4">
              {t('subtitle')}
            </p>
          </header>

          <FeedbackForm />
        </div>
      </main>

      <Button
        size="lg"
        onClick={handleViewFeedbackClick}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 rounded-full shadow-lg hover:shadow-xl transition-all text-sm sm:text-base"
      >
        <MessageSquare className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
        <span className="hidden xs:inline">{t('viewFeedback')}</span>
        <span className="xs:hidden">{t('viewFeedbackShort')}</span>
      </Button>

      <PinDialog
        open={isPinDialogOpen}
        onOpenChange={setIsPinDialogOpen}
        onSuccess={handlePinSuccess}
      />

      <Sheet open={isTableOpen} onOpenChange={setIsTableOpen}>
        <SheetContent side="right" className="w-full sm:max-w-3xl overflow-y-auto p-4 sm:p-6">
          <FeedbackTable />
        </SheetContent>
      </Sheet>

      <footer className="py-4 sm:py-6 text-center text-xs sm:text-sm text-slate-600 px-4">
        © 2025. Built with love using{' '}
        <a
          href="https://caffeine.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline font-medium"
        >
          caffeine.ai
        </a>
      </footer>

      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </QueryClientProvider>
  );
}
