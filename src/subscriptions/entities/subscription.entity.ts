// export class Subscription {}
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  ownerName: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  middleName?: string;

  @Column()
  lastName: string;

  @Column()
  ageGroup: string;

  @Column()
  ownerTel: string;

  @Column({ nullable: true })
  tel: string;

  @Column({ nullable: true })
  code: string;

  @Column()
  color: string;

  @Column({ default: 'Mail' })
  gender: string;

  @Column()
  size: string;

  @Column()
  station: string;

  @Column({ nullable: true })
  remarks: string;

  @Column()
  price: string;

  @Column({ nullable: true })
  self: number;

  @Column({ nullable: true })
  other: number;

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  createdDate: Date;

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  updatedDate: Date;

  @Column({ default: true })
  isSelf: boolean;
}
