import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { SubCategoriesService } from './sub_categories.service';
import { CategoryDto } from './dto/create-sub_category.dto';
import { Response } from 'express';
// import { UpdateSubCategoryDto } from './dto/update-sub_category.dto';

@Controller('sub-categories')
export class SubCategoriesController {
  constructor(private readonly subCategoriesService: SubCategoriesService) {}

  @Post('create')
  create(@Body() createSubCategoryDto: CategoryDto, @Res() res: Response) {
    return this.subCategoriesService.create(createSubCategoryDto, res);
  }

  @Get()
  findAll() {
    return this.subCategoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subCategoriesService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateSubCategoryDto: UpdateSubCategoryDto) {
  //   return this.subCategoriesService.update(+id, updateSubCategoryDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subCategoriesService.remove(+id);
  }
}
