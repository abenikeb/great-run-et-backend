import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
import { StockControlService } from 'src/stock-controls/stock-controls.service';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscribersRepository: Repository<Subscription>,
    private readonly stockControlService: StockControlService,
  ) {}

  async create(
    createSubscriptionDto: CreateSubscriptionDto,
    res,
  ): Promise<any> {
    const { isSelf, ownerTel, price, color, size } = createSubscriptionDto;
    console.log({ isSelf, ownerTel, price, color, size });

    // Check if isSelf or ownerTel is empty
    if (!isSelf && !ownerTel) {
      res.status(HttpStatus.BAD_REQUEST).send('Data is not completed');
      throw new HttpException('Data is not completed', HttpStatus.BAD_REQUEST);
    }

    // Check if price per T-shirt is $1200
    if (price !== '1200') {
      throw new HttpException(
        'Invalid price per T-shirt',
        HttpStatus.BAD_REQUEST,
      );
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

      if (otherCount >= 1) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .send('Customer subscribed for other more than two');
        throw new HttpException(
          'Customer subscribed for other more than 2',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    // Check stock availability
    const stockAvailable =
      await this.stockControlService.checkStockAvailability(color, size);
    if (!stockAvailable) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .send(
          `Stock not available for ${color} color and ${size} size or Selected stock is not available`,
        );
      return null;
    }

    // Create a new subscription
    let newSubscription = this.subscribersRepository.create(
      createSubscriptionDto,
    );
    await this.subscribersRepository.save(newSubscription);

    // Update subscription table
    let qoutaCounter;
    if (isSelf) {
      qoutaCounter = await this.subscribersRepository.findOne({
        where: { id: newSubscription.id },
      });
      console.log({
        qoutaCounter_self: qoutaCounter.self,
      });
      qoutaCounter.self += 1;
    } else {
      let totalQoutaCounter = await this.subscribersRepository.find({
        where: { ownerTel: ownerTel, isSelf: false },
        order: { id: 'DESC' },
      });
      let prevQouta = totalQoutaCounter[1]?.other;

      if (prevQouta) {
        qoutaCounter = await this.subscribersRepository.findOne({
          where: { id: newSubscription.id },
        });
        qoutaCounter.other = prevQouta + 1;
      } else {
        qoutaCounter = await this.subscribersRepository.findOne({
          where: { id: newSubscription.id },
        });
        qoutaCounter.other += 1;
      }
    }
    await this.subscribersRepository.save(qoutaCounter);

    // Update Waves tables in StockControlService
    await this.stockControlService.updateStock(color, size);

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
