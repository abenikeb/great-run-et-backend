import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryDto } from './dto/create-sub_category.dto';
import { Categories } from './entities/sub_category.entity';
// import { UpdateSubCategoryDto } from './dto/update-sub_category.dto';

@Injectable()
export class SubCategoriesService {
  constructor(
    @InjectRepository(Categories)
    private readonly categoryRepository: Repository<Categories>,
  ) {}

  async findAll(): Promise<CategoryDto[]> {
    const categories: Categories[] = await this.categoryRepository.find();
    return categories.map((category) => this.mapToDTO(category));
  }

  async create(categoryDTO: CategoryDto, res): Promise<CategoryDto> {
    const category: Categories = this.mapToEntity(categoryDTO);

    const createdCategory: Categories = await this.categoryRepository.save(
      category,
    );

    return res.status(201).send(this.mapToDTO(createdCategory));
  }

  private mapToDTO(category: Categories): CategoryDto {
    const categoryDTO: CategoryDto = new CategoryDto();
    // categoryDTO.id = category.id;
    categoryDTO.parentId = category.parentId;
    categoryDTO.name = category.name;
    categoryDTO.description = category.description;
    // categoryDTO.createdAt = category.createdAt;
    // categoryDTO.modifiedAt = category.modifiedAt;
    return categoryDTO;
  }

  private mapToEntity(categoryDTO: CategoryDto): Categories {
    const category: Categories = new Categories();
    // category.id = categoryDTO.id;
    category.parentId = categoryDTO.parentId;
    category.name = categoryDTO.name;
    category.description = categoryDTO.description;
    // category.createdAt = categoryDTO.createdAt;
    // category.modifiedAt = categoryDTO.modifiedAt;
    return category;
  }

  findOne(id: number) {
    return `This action returns a #${id} subCategory`;
  }

  // update(id: number, updateSubCategoryDto: UpdateSubCategoryDto) {
  //   return `This action updates a #${id} subCategory`;
  // }

  remove(id: number) {
    return `This action removes a #${id} subCategory`;
  }
}
