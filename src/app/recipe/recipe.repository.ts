import { Inject, Injectable } from '@nestjs/common';
import { Collection, Filter, FindOptions, ReturnDocument, UpdateFilter } from 'mongodb';
import { RECIPE_COLLECTION } from '../../common/factory/recipe.factory';
import { RecipeEntity } from './models/recipe.entity';

@Injectable()
export class RecipeRepository {
  private readonly primaryKey = '_id';

  constructor(
    @Inject(RECIPE_COLLECTION)
    private readonly collection: Collection<RecipeEntity>,
  ) {}

  async findOne(filter: Filter<RecipeEntity>, options?: FindOptions): Promise<RecipeEntity> {
    return this.collection.findOne(filter, options);
  }

  async findById(id: string, options?: FindOptions): Promise<RecipeEntity> {
    return this.collection.findOne({ [this.primaryKey]: id } as Filter<RecipeEntity>, options);
  }

  async find(filter: Filter<RecipeEntity>, options?: FindOptions): Promise<RecipeEntity[]> {
    return this.collection.find(filter, options).toArray();
  }

  async create(entity: RecipeEntity): Promise<RecipeEntity> {
    await this.collection.insertOne(entity);
    return entity;
  }

  async findOneAndUpdate(id: string, fields: UpdateFilter<RecipeEntity>): Promise<RecipeEntity> {
    return this.collection.findOneAndUpdate(
      { [this.primaryKey]: id } as Filter<RecipeEntity>,
      { $set: fields },
      { returnDocument: ReturnDocument.AFTER },
    );
  }

  async deleteOne(id: string) {
    return this.collection.deleteOne({ [this.primaryKey]: id } as Filter<RecipeEntity>);
  }

  async count(filter: Partial<RecipeEntity>): Promise<number> {
    return this.collection.countDocuments(filter);
  }
}
