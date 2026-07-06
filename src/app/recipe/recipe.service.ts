import { randomUUID } from 'crypto';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { DeleteResult } from '../../common/models/common.model';
import { RecipeEntity } from './models/recipe.entity';
import { CreateRecipeInput, Recipe, UpdateRecipeInput } from './models/recipe.model';
import { RecipeRepository } from './recipe.repository';
import { NotFoundError } from '../../common/errors';

@Injectable()
export class RecipeService {
  constructor(private readonly recipeRepository: RecipeRepository) {}

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

  async create(
    args: CreateRecipeInput,
    userId: string,
    options?: { isDemo?: boolean; expiresAt?: Date },
  ): Promise<Recipe> {
    if (options?.isDemo) {
      const count = await this.recipeRepository.count({ userId });
      if (count >= 6) throw new ForbiddenException('demo recipe limit reached');
    }
    const entity: RecipeEntity = {
      ...args,
      userId,
      _id: randomUUID(),
      ...(options?.expiresAt && { expiresAt: options.expiresAt }),
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
