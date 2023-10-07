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

  async create(
    createSubscriptionDto: CreateSubscriptionDto,
    res,
  ): Promise<any> {
    const { isSelf, ownerTel } = createSubscriptionDto;

    // Check if isSelf or ownerTel is empty
    if (!isSelf && !ownerTel) {
      res.status(HttpStatus.BAD_REQUEST).send('Data is not completed');
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

      if (selfCount >= 1) {
        res.status(HttpStatus.BAD_REQUEST).send('Customer already subscribed');
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

      if (otherCount > 1) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .send('Customer subscribed for other more than two');
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

    res.status(HttpStatus.CREATED).send('Customer successfully subscribed!');

    return {
      status: HttpStatus.CREATED,
      message: 'Customer successfully subscribed!',
      success: true,
    };
  }

  async findAll(ownerTel: string, res): Promise<any | null> {
    if (!ownerTel) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Parent phone cannot be empty.',
        success: false,
      });
      // return {
      //   message: 'Parent phone cannot be empty.',
      //   success: false,
      // };
    }

    const selfCount = await this.subscribersRepository
      .createQueryBuilder('subscriber')
      .where('subscriber.ownerTel = :ownerTel', { ownerTel })
      .andWhere('subscriber.self > 0')
      .andWhere('YEAR(subscriber.createdDate) = YEAR(CURRENT_DATE())')
      .getCount();

    const otherCount = await this.subscribersRepository
      .createQueryBuilder('subscriber')
      .where('subscriber.ownerTel = :ownerTel', { ownerTel })
      .andWhere('subscriber.other > 1')
      .andWhere('YEAR(subscriber.createdDate) = YEAR(CURRENT_DATE())')
      .getCount();

    res.status(HttpStatus.CREATED).json({
      self: selfCount,
      other: otherCount,
    });
    // return {
    //   self: selfCount,
    //   other: otherCount,
    // };
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
