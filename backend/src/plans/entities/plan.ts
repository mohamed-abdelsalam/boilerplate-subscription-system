import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { PlanPrice } from './plan-price';

@Entity()
export class Plan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  providerId: string;

  @Column()
  createdBy: string;

  @Column()
  name: string;

  @OneToMany(() => PlanPrice, (planPrice) => planPrice.plan, { cascade: true })
  prices: PlanPrice[];
}
