import { randomUUID } from 'crypto';
import { Inject, Injectable } from '@nestjs/common';
import { DeleteResult } from '../../common/models/common.model';
import { RecipeEntity } from './models/recipe.entity';
import { CreateRecipeArgs, Recipe, UpdateRecipeArgs } from './models/recipe.model';
import { RecipeRepository } from './recipe.repository';
import { NotFoundError } from '../../common/errors';
import { TRACER_CLIENT, TracerClient } from '../../shared/tracer/tracer.module';

@Injectable()
export class RecipeService {
  constructor(
    private readonly recipeRepository: RecipeRepository,
    @Inject(TRACER_CLIENT) private tracer: TracerClient,
  ) {}

  async findById(id: string, traceId?: string): Promise<Recipe> {
    const start = new Date();
    const op = `find_recipe by id: ${id}`;
    const record = await this.recipeRepository.findById(id);
    if (!record) {
      const end = new Date();
      this.tracer.sendErrorSpan(traceId, op, 'Recipe not found', start, end);
      throw new NotFoundError('Recipe');
    }
    const end = new Date();
    this.tracer.sendSpan(traceId, op, start, end);
    return mapToModel(record);
  }

  async find(userId: string, traceId?: string): Promise<Recipe[]> {
    const start = new Date();
    const op = 'find_recipes';
    const records = await this.recipeRepository.find({ userId });
    const end = new Date();
    this.tracer.sendSpan(traceId, op, start, end);
    return records.map(mapToModel);
  }

  async create(args: CreateRecipeArgs, userId: string, traceId?: string): Promise<Recipe> {
    const start = new Date();
    const op = 'create_recipe';
    const entity: RecipeEntity = {
      ...args,
      userId,
      _id: randomUUID(),
    };
    const record = await this.recipeRepository.create(entity);
    const end = new Date();
    this.tracer.sendSpan(traceId, op, start, end);
    return mapToModel(record);
  }

  async update(id: string, args: UpdateRecipeArgs, traceId?: string): Promise<Recipe> {
    const start = new Date();
    const op = `update_recipe by id: ${id}`;
    const record = await this.recipeRepository.findOneAndUpdate(id, args);
    if (!record) {
      const end = new Date();
      this.tracer.sendErrorSpan(traceId, op, 'Recipe not found', start, end);
      throw new NotFoundError('Recipe');
    }
    const end = new Date();
    this.tracer.sendSpan(traceId, op, start, end);
    return mapToModel(record);
  }

  async delete(id: string, traceId?: string): Promise<DeleteResult> {
    const start = new Date();
    const op = `delete_recipe by id: ${id}`;
    const result = await this.recipeRepository.deleteOne(id);
    const end = new Date();
    this.tracer.sendSpan(traceId, op, start, end);
    return result;
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
