import { ConfigService } from '@nestjs/config';
import { DatabaseConfig } from '../../config/database';
import { Collection, Db } from 'mongodb';
import { DB_CLIENT } from '../../shared/mongo/mongo.module';
import { RecipeEntity } from '../../app/recipe/models/recipe.entity';

export const RECIPE_COLLECTION = 'RECIPE_COLLECTION';

export const RecipeCollectionFactory = {
  provide: RECIPE_COLLECTION,
  useFactory: (configService: ConfigService, db: Db): Collection<RecipeEntity> => {
    const { collections } = configService.get<DatabaseConfig>('database');
    return db.collection(collections.recipe);
  },
  inject: [ConfigService, DB_CLIENT],
};
