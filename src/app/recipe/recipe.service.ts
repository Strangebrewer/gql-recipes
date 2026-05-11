import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { DeleteResult } from '../../common/models/common.model';
import { RecipeEntity } from './models/recipe.entity';
import { CreateRecipeInput, Recipe, UpdateRecipeInput } from './models/recipe.model';
import { RecipeRepository } from './recipe.repository';
import { NotFoundError } from '../../common/errors';

@Injectable()
export class RecipeService {
  constructor(
    private readonly recipeRepository: RecipeRepository,
  ) {}

  async findById(id: string): Promise<Recipe> {
    const record = await this.recipeRepository.findById(id);
    if (!record) {
      throw new NotFoundError('Recipe');
    }
    return mapToModel(record);
  }

  async find(userId: string): Promise<Recipe[]> {
    const records = await this.recipeRepository.find({ userId });
    return records.map(mapToModel);
  }

  async create(args: CreateRecipeInput, userId: string): Promise<Recipe> {
    const entity: RecipeEntity = {
      ...args,
      userId,
      _id: randomUUID(),
    };
    const record = await this.recipeRepository.create(entity);
    return mapToModel(record);
  }

  async update(id: string, args: UpdateRecipeInput): Promise<Recipe> {
    const record = await this.recipeRepository.findOneAndUpdate(id, args);
    if (!record) {
      throw new NotFoundError('Recipe');
    }
    return mapToModel(record);
  }

  async delete(id: string): Promise<DeleteResult> {
    return this.recipeRepository.deleteOne(id);
  }
}

function mapToModel(entity: RecipeEntity): Recipe {
  return {
    id: entity._id,
    userId: entity.userId,
    name: entity.name,
    ingredients: entity.ingredients,
    directions: entity.directions,
    description: entity.description,
    prepTime: entity.prepTime,
    cookTime: entity.cookTime,
    servings: entity.servings,
    tags: entity.tags,
    imageUrl: entity.imageUrl,
    macros: entity.macros,
  };
}
