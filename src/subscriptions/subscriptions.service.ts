import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
import { StockControlService } from 'src/stock-controls/stock-controls.service';
import { Response } from 'express';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscribersRepository: Repository<Subscription>,
    private readonly stockControlService: StockControlService,
  ) {}

  async create(
    createSubscriptionDto: CreateSubscriptionDto,
    res?: Response,
  ): Promise<any> {
    try {
      const { isSelf, ownerTel, price, color, size, station } =
        createSubscriptionDto;

      // Check if isSelf or ownerTel is empty
      if (!isSelf && !ownerTel) {
        res.status(HttpStatus.BAD_REQUEST).send('Data is not completed');
        throw new HttpException(
          'Data is not completed',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Check if price per T-shirt is $1200
      if (price !== '1200') {
        throw new HttpException(
          'Invalid price per T-shirt',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (station === '') {
        res.status(HttpStatus.BAD_REQUEST).send('Station can not br null');
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Station can not br null',
          success: false,
        };
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
          res
            .status(HttpStatus.BAD_REQUEST)
            .send('Customer already subscribed');
          return {
            status: HttpStatus.BAD_REQUEST,
            message: 'Customer already subscribed',
            success: false,
          };
          // throw new HttpException(
          //   'Customer already subscribed',
          //   HttpStatus.BAD_REQUEST,
          // );
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
          return {
            status: HttpStatus.BAD_REQUEST,
            message: 'Customer subscribed for other more than two',
            success: false,
          };
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
        return {
          status: HttpStatus.BAD_REQUEST,
          message: `Stock not available for ${color} color and ${size} size or Selected stock is not available`,
          success: false,
        };
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

      // res.status(HttpStatus.CREATED).send('Customer successfully subscribed!');

      return {
        status: HttpStatus.CREATED,
        message: 'Customer successfully subscribed!',
        success: true,
      };
    } catch (error) {
      res.status(500).send('Something went Wrong' + error);
      return {
        message: 'Something went Wrong',
        success: false,
      };
    }
  }

  async findAll(ownerTel: string, res): Promise<any | null> {
    if (!ownerTel) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Parent phone cannot be empty.',
        success: false,
      });
      return {
        message: 'Parent phone cannot be empty.',
        success: false,
      };
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
      .andWhere('subscriber.other > 0')
      .andWhere('YEAR(subscriber.createdDate) = YEAR(CURRENT_DATE())')
      .getCount();

    res.status(HttpStatus.OK).json({
      self: selfCount,
      other: otherCount,
      green: {
        small: 0,
        medium: 30,
        large: 50,
        extra_large: 50,
        extra_extra_large: 20,
      },
      yellow: {
        small: 50,
        medium: 150,
        large: 250,
        extra_large: 200,
        extra_extra_large: 100,
      },
    });
    // return {
    //   self: selfCount,
    //   other: otherCount,
    // };
  }

  async findAllData(ownerTel: string, res): Promise<any | null> {
    if (!ownerTel) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Parent phone cannot be empty.',
        success: false,
      });
      return {
        message: 'Parent phone cannot be empty.',
        success: false,
      };
    }

    let result = await this.subscribersRepository.find({
      where: { ownerTel },
    });

    res.status(HttpStatus.OK).send(result);

    return result;

    // return {
    //   self: selfCount,
    //   other: otherCount,
    // };
  }

  findOne(id: number) {
    return `This action returns a #${id} subscription`;
  }

  async update(merch_order_id: string, reference: string) {
    try {
      if (!reference) {
        return {
          message: 'Reference cannot be empty.',
          success: false,
        };
      }

      await this.subscribersRepository.update(
        { merch_order_id },
        { code: reference },
      );

      return {
        message: 'Confirmation',
        success: true,
      };
    } catch (error) {
      return {
        message: 'Error',
        success: false,
      };
    }
    // return `This action updates a #${id} subscription`;
  }

  remove(id: number) {
    return `This action removes a #${id} subscription`;
  }
}
