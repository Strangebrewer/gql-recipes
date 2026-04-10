import { Injectable } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { IdGeneratorService } from '../../shared/libs/id-generator/id-generator.service';
import { RecipeEntity } from './recipe.entity';
import { CreateRecipeArgs, DeleteResult, Recipe, UpdateRecipeArgs } from './recipe.model';
import { RecipeRepository } from './recipe.repository';

@Injectable()
export class RecipeService {
  constructor(
    private readonly recipeRepository: RecipeRepository,
    private readonly idGenerator: IdGeneratorService,
  ) {}

  async findById(id: string): Promise<Recipe> {
    const record = await this.recipeRepository.findById(id);
    if (!record) {
      throw new GraphQLError('Recipe not found', {
        extensions: { code: 404 },
      });
    }
    return mapToModel(record);
  }

  async find(userId: string): Promise<Recipe[]> {
    const records = await this.recipeRepository.find({ userId });
    return records.map(mapToModel);
  }

  async create(args: CreateRecipeArgs, userId: string): Promise<Recipe> {
    const entity: RecipeEntity = {
      ...args,
      userId,
      id: this.idGenerator.generate('RCP'),
    };
    const record = await this.recipeRepository.create(entity);
    return mapToModel(record);
  }

  async update(id: string, args: UpdateRecipeArgs): Promise<Recipe> {
    const record = await this.recipeRepository.findOneAndUpdate(id, args);
    if (!record) {
      throw new GraphQLError('Recipe not found', {
        extensions: { code: 404 },
      });
    }
    return mapToModel(record);
  }

  async delete(id: string): Promise<DeleteResult> {
    return this.recipeRepository.deleteOne(id);
  }
}

function mapToModel(entity: RecipeEntity): Recipe {
  return {
    id: entity.id,
    thing: entity.thing,
    userId: entity.userId,
  };
}
