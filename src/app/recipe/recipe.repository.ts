import { Inject, Injectable } from '@nestjs/common';
import { Collection, Filter, FindOptions, ReturnDocument, UpdateFilter } from 'mongodb';
import { RECIPE_COLLECTION } from '../../common/factory/recipe.factory';
import { RecipeEntity, RecipeEntityRead } from './models/recipe.entity';

@Injectable()
export class RecipeRepository {
  private readonly primaryKey = 'id';

  constructor(
    @Inject(RECIPE_COLLECTION)
    private readonly collection: Collection<RecipeEntityRead>,
  ) {}

  async findOne(filter: Filter<RecipeEntityRead>, options?: FindOptions): Promise<RecipeEntityRead> {
    return this.collection.findOne(filter, options);
  }

  async findById(id: string, options?: FindOptions): Promise<RecipeEntityRead> {
    return this.collection.findOne({ [this.primaryKey]: id } as Filter<RecipeEntityRead>, options);
  }

  async find(filter: Filter<RecipeEntityRead>, options?: FindOptions): Promise<RecipeEntityRead[]> {
    return this.collection.find(filter, options).toArray();
  }

  async create(entity: RecipeEntity): Promise<RecipeEntityRead> {
    const result = await this.collection.insertOne(entity as RecipeEntityRead);
    return { _id: result.insertedId.toString(), ...entity };
  }

  async findOneAndUpdate(id: string, fields: UpdateFilter<RecipeEntity>): Promise<RecipeEntityRead> {
    return this.collection.findOneAndUpdate(
      { [this.primaryKey]: id } as Filter<RecipeEntityRead>,
      { $set: fields },
      { returnDocument: ReturnDocument.AFTER },
    );
  }

  async deleteOne(id: string) {
    return this.collection.deleteOne({ [this.primaryKey]: id } as Filter<RecipeEntityRead>);
  }
}
