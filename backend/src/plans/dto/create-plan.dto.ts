import { ApiProperty } from '@nestjs/swagger';

export class CreatePlanDto {
  @ApiProperty({ example: 'Basic' })
  name: string;

  @ApiProperty({
    example: [
      {
        unitAmount: 1000,
        currency: 'eur',
        recurring: { interval: 'day', intervalCount: 5 },
        nickname: 'Basic Daily',
      },
    ],
    type: 'array',
    minLength: 1,
  })
  prices: PriceDto[];
}

class RecurringDto {
  @ApiProperty({
    example: 'day',
    type: 'string',
    enum: ['day', 'month', 'week', 'year'],
  })
  interval: Intervals;

  @ApiProperty({ example: 5 })
  intervalCount: number;
}

type Intervals = 'day' | 'month' | 'week' | 'year';

export class PriceDto {
  @ApiProperty({ example: 1000 })
  unitAmount: number;

  @ApiProperty({ example: 'eur' })
  currency: string;

  @ApiProperty({
    example: { interval: 'day', intervalCount: 5 },
    type: RecurringDto,
  })
  recurring: RecurringDto;
}
