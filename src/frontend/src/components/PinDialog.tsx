import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Lock } from 'lucide-react';
import { toast } from 'sonner';

const CORRECT_PIN = '93023';

interface PinDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function PinDialog({ open, onOpenChange, onSuccess }: PinDialogProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const { t } = useLanguage();

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setPin(value);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (pin === CORRECT_PIN) {
      setPin('');
      setError('');
      onSuccess();
      toast.success(t('pinSuccess'));
    } else {
      setError(t('pinError'));
      toast.error(t('pinError'));
    }
  };

  const handleClose = () => {
    setPin('');
    setError('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            {t('pinDialogTitle')}
          </DialogTitle>
          <DialogDescription>
            {t('pinDialogDescription')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="pin" className="text-base font-semibold">
                {t('pinLabel')}
              </Label>
              <Input
                id="pin"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={pin}
                onChange={handlePinChange}
                placeholder={t('pinPlaceholder')}
                className="text-lg h-12 text-center tracking-widest border-2"
                maxLength={5}
                autoFocus
              />
              {error && (
                <p className="text-sm text-destructive font-medium">{error}</p>
              )}
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={pin.length === 0}>
              {t('verify')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
