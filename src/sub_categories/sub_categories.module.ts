import { Module } from '@nestjs/common';
import { SubCategoriesService } from './sub_categories.service';
import { SubCategoriesController } from './sub_categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categories } from './entities/sub_category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Categories])],
  controllers: [SubCategoriesController],
  providers: [SubCategoriesService],
})
export class SubCategoriesModule {}
