import { END_POINTS } from '../endpoints';

type CreatePlanPayload = {
  planName: string;
  prices: Price[];
}

type Price = {
  unitAmount: number;
  currency: string;
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