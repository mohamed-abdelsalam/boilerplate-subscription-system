import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Plan } from './plan';

@Entity()
export class PlanPrice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  currency: string;

  @Column()
  providerId: string;

  @Column()
  unitAmount: number;

  @Column({ type: 'enum', enum: ['day', 'month', 'week', 'year'] })
  interval: string;

  @Column()
  intervalCount: number;

  @ManyToOne(() => Plan, (plan) => plan.prices)
  plan: Plan;

  constructor(init?: Partial<PlanPrice>) {
    Object.assign(this, init);
  }
}
