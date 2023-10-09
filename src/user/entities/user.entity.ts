import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  user_name: string;

  @Column()
  phone: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @Column()
  forgot_password: string;

  @Column()
  email: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  verified: boolean;

  @Column()
  gender: string;

  @Column()
  otp: string;

  // @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  // otp_expiry: Date;

  @Column()
  payment_id: number;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  lat: number;

  @Column()
  lng: number;

  @Column()
  role: number;

  // @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  // created_at: number;

  // @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  // modified_at: number;

  @Column()
  rating: number;

  // @OneToMany((type) => Product, (product) => product.id)
  // products: Product[];
}
