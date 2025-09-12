export class CreatePlanDto {
  planName: string;
  createdBy: string;
  prices: Price[];
}

export class Price {
  unitAmount: number;
  currency: string;
}
