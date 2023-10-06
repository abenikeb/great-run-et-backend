// import { Injectable } from '@nestjs/common';
// import { CreateSubscriptionDto } from './dto/create-subscription.dto';
// import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscribersRepository: Repository<Subscription>,
  ) {}

  async create(createSubscriptionDto: CreateSubscriptionDto): Promise<any> {
    const { isSelf, ownerTel } = createSubscriptionDto;

    // Check if isSelf or ownerTel is empty
    if (!isSelf && !ownerTel) {
      throw new HttpException('Data is not completed', HttpStatus.BAD_REQUEST);
    }

    // Check if isSelf is true and selfCount is greater than 1
    if (isSelf) {
      const selfCount = await this.subscribersRepository
        .createQueryBuilder('subscriber')
        .where('subscriber.ownerTel = :ownerTel', { ownerTel })
        .andWhere('subscriber.self > 0')
        .andWhere('YEAR(subscriber.createdDate) = YEAR(CURRENT_DATE())')
        .getCount();

      if (selfCount > 1) {
        throw new HttpException(
          'Customer already subscribed',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      // Check if isSelf is false and otherCount is greater than 2
      const otherCount = await this.subscribersRepository
        .createQueryBuilder('subscriber')
        .where('subscriber.ownerTel = :ownerTel', { ownerTel })
        .andWhere('subscriber.other > 1')
        .andWhere('YEAR(subscriber.createdDate) = YEAR(CURRENT_DATE())')
        .getCount();

      if (otherCount > 2) {
        throw new HttpException(
          'Customer subscribed for other more than 2',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    // Create a new subscription
    const newSubscription = this.subscribersRepository.create(
      createSubscriptionDto,
    );
    await this.subscribersRepository.save(newSubscription);

    return {
      status: HttpStatus.CREATED,
      message: 'Customer successfully subscribed!',
      success: true,
    };
  }

  findAll() {
    return `This action returns all subscriptions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subscription`;
  }

  // update(id: number, updateSubscriptionDto: UpdateSubscriptionDto) {
  //   return `This action updates a #${id} subscription`;
  // }

  remove(id: number) {
    return `This action removes a #${id} subscription`;
  }
}
