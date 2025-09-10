import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";

@Entity()
export class UserPermission {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => User, { cascade: true })
    user: User;

    @Column()
    permission: string;
}