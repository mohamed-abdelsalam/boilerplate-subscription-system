import { ApiProperty } from '@nestjs/swagger';

export class CreateSubscriptionDto {
  @ApiProperty({ example: '12345-12o33n-1939dk' })
  planId: string;

  @ApiProperty({ example: '12345-12o33n-1939dk' })
  priceId: string;

  @ApiProperty({ example: 'subscription', enum: ['subscription', 'onceoff'] })
  type: SubscriptionType;
}

export type SubscriptionType = 'subscription' | 'onceoff';
