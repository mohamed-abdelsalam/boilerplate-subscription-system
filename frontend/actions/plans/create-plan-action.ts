import { END_POINTS } from '@actions/endpoints';

type CreatePlanPayload = {
  name: string;
  prices: Price[];
}

type Interval = 'day' | 'month' | 'week' | 'year';

type Recurring = {
  interval: Interval;
  intervalCount: number;
}

export type Price = {
  unitAmount: number;
  currency: string;
  recurring: Recurring;
}

export async function CreatePlanAction(createPlanPayload: CreatePlanPayload): Promise<Response> {
  return fetch(END_POINTS.CREATE_PLAN, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(createPlanPayload),
    credentials: 'include',
  });
}