import { Module } from '@nestjs/common';
import { SharedModule } from '../../shared/shared.module';
import { RecipeCollectionFactory } from './recipe.factory';
import { RecipeRepository } from './recipe.repository';
import { RecipeResolver } from './recipe.resolver';
import { RecipeService } from './recipe.service';

@Module({
  imports: [SharedModule],
  providers: [
    RecipeCollectionFactory,
    RecipeRepository,
    RecipeResolver,
    RecipeService,
  ],
})
export class RecipeModule {}
