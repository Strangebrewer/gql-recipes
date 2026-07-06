import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { IsDemo, JwtAccessGuard, JwtUserId } from '../../common/guards/jwt-access.guard';
import { DeleteResult } from '../../common/models/common.model';
import { CreateRecipeInput, Recipe, UpdateRecipeInput } from './models/recipe.model';
import { RecipeService } from './recipe.service';

@Resolver(() => Recipe)
export class RecipeResolver {
  constructor(private readonly recipeService: RecipeService) {}

  @Query(() => Recipe)
  @UseGuards(JwtAccessGuard)
  async getRecipe(@Args('id') id: string): Promise<Recipe> {
    return this.recipeService.findById(id);
  }

  @Query(() => [Recipe])
  @UseGuards(JwtAccessGuard)
  async getRecipes(@JwtUserId() userId: string): Promise<Recipe[]> {
    return this.recipeService.find(userId);
  }

  @Mutation(() => Recipe)
  @UseGuards(JwtAccessGuard)
  async createRecipe(
    @JwtUserId() userId: string,
    @IsDemo() isDemo: boolean,
    @Args('input') input: CreateRecipeInput,
  ): Promise<Recipe> {
    return this.recipeService.create(input, userId, { isDemo });
  }

  @Mutation(() => Recipe)
  @UseGuards(JwtAccessGuard)
  async updateRecipe(
    @Args('id') id: string,
    @Args('input') input: UpdateRecipeInput,
  ): Promise<Recipe> {
    return this.recipeService.update(id, input);
  }

  @Mutation(() => DeleteResult)
  @UseGuards(JwtAccessGuard)
  async deleteRecipe(@Args('id') id: string): Promise<DeleteResult> {
    return this.recipeService.delete(id);
  }
}
