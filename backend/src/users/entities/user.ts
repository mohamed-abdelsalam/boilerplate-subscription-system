import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserPermission } from './user-permission';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @OneToMany(type => UserPermission, permission => permission.user)
  permissions: UserPermission[]
}
