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

  @ManyToOne(() => Plan, (plan) => plan.prices)
  plan: Plan;
}
