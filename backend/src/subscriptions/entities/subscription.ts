import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  stripeSubscriptionId: string;

  @Column()
  subscriptionType: string;

  @Column()
  status: SubscriptionStatus;

  @Column()
  createdAt: number;
}

type SubscriptionStatus = 'active' | 'cancelled' | 'unpaid';
