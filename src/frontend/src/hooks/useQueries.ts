import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { FeedbackEntry } from '../backend';

export function useGetAllFeedback() {
  const { actor, isFetching } = useActor();

  return useQuery<FeedbackEntry[]>({
    queryKey: ['feedback'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllFeedback();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitFeedback() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      age,
      country,
      team,
      thoughts,
      feelings,
    }: {
      name: string;
      age: bigint;
      country: string;
      team: string;
      thoughts: string;
      feelings: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.submitFeedback(name, age, country, team, thoughts, feelings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
    },
  });
}
