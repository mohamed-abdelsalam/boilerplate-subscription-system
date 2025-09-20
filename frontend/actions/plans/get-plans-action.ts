import { END_POINTS } from '../endpoints';

export type Plan = {
  id: string;
  providerId: string;
  name: string;
  prices: PlanPrice[];
};

type PlanPrice = {
  id: string;
  currency: string;
  providerId: string;
  unitAmount: number;
};

export async function GetPlansAction(): Promise<Plan[]> {
  const response = await fetch(END_POINTS.GET_PLANS, {
    method: 'GET',
  });
  if (response.ok) {
    return await response.json();
  } else {
    return null;
  }
};