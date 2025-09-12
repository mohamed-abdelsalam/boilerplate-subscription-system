import { PlanPrice } from './plan-price';

export class Plan {
  id: string; // aka productId in stripe
  createdBy: string;
  name: string;
  prices: PlanPrice[];
}
