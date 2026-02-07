import { useState } from 'react';
import { useSubmitFeedback } from '../hooks/useQueries';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function FeedbackForm() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [country, setCountry] = useState('');
  const [team, setTeam] = useState('');
  const [thoughts, setThoughts] = useState('');
  const [feelings, setFeelings] = useState('');

  const submitFeedback = useSubmitFeedback();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !age || !country.trim() || !team.trim() || !thoughts.trim() || !feelings.trim()) {
      toast.error(t('errorFillFields'));
      return;
    }

    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 0 || ageNum > 150) {
      toast.error(t('errorValidAge'));
      return;
    }

    try {
      await submitFeedback.mutateAsync({
        name: name.trim(),
        age: BigInt(ageNum),
        country: country.trim(),
        team: team.trim(),
        thoughts: thoughts.trim(),
        feelings: feelings.trim(),
      });

      // Clear form
      setName('');
      setAge('');
      setCountry('');
      setTeam('');
      setThoughts('');
      setFeelings('');

      toast.success(t('successMessage'));
    } catch (error) {
      toast.error(t('errorSubmit'));
      console.error('Submission error:', error);
    }
  };

  return (
    <Card className="shadow-xl border-2 border-slate-200">
      <CardHeader className="bg-gradient-to-r from-sky-100 to-blue-100 border-b-2 border-slate-200">
        <CardTitle className="text-2xl text-slate-800">{t('formTitle')}</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base font-semibold text-slate-700">
              {t('labelName')}
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('placeholderName')}
              className="text-base h-12 border-2 border-slate-300 focus:border-sky-400"
              disabled={submitFeedback.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="age" className="text-base font-semibold text-slate-700">
              {t('labelAge')}
            </Label>
            <Input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder={t('placeholderAge')}
              min="0"
              max="150"
              className="text-base h-12 border-2 border-slate-300 focus:border-sky-400"
              disabled={submitFeedback.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country" className="text-base font-semibold text-slate-700">
              {t('labelCountry')}
            </Label>
            <Input
              id="country"
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder={t('placeholderCountry')}
              className="text-base h-12 border-2 border-slate-300 focus:border-sky-400"
              disabled={submitFeedback.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="team" className="text-base font-semibold text-slate-700">
              {t('labelTeam')}
            </Label>
            <Input
              id="team"
              type="text"
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              placeholder={t('placeholderTeam')}
              className="text-base h-12 border-2 border-slate-300 focus:border-sky-400"
              disabled={submitFeedback.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="thoughts" className="text-base font-semibold text-slate-700">
              {t('labelThoughts')}
            </Label>
            <Textarea
              id="thoughts"
              value={thoughts}
              onChange={(e) => setThoughts(e.target.value)}
              placeholder={t('placeholderThoughts')}
              rows={5}
              className="text-base border-2 border-slate-300 focus:border-sky-400 resize-none"
              disabled={submitFeedback.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="feelings" className="text-base font-semibold text-slate-700">
              {t('labelFeelings')}
            </Label>
            <Textarea
              id="feelings"
              value={feelings}
              onChange={(e) => setFeelings(e.target.value)}
              placeholder={t('placeholderFeelings')}
              rows={5}
              className="text-base border-2 border-slate-300 focus:border-sky-400 resize-none"
              disabled={submitFeedback.isPending}
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full text-lg h-14 font-semibold"
            disabled={submitFeedback.isPending}
          >
            {submitFeedback.isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {t('submitting')}
              </>
            ) : (
              t('submitButton')
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
