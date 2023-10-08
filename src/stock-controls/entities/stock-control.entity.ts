import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GreenWave {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  small: number;

  @Column({ default: 30 })
  medium: number;

  @Column({ default: 50 })
  large: number;

  @Column({ default: 50 })
  extraLarge: number;

  @Column({ default: 20 })
  extraExtraLarge: number;
}

@Entity()
export class YellowWave {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 50 })
  small: number;

  @Column({ default: 150 })
  medium: number;

  @Column({ default: 250 })
  large: number;

  @Column({ default: 200 })
  extraLarge: number;

  @Column({ default: 100 })
  extraExtraLarge: number;
}
