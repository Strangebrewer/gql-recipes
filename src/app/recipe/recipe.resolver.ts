import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAccessGuard, JwtUserId } from '../../common/guards/jwt-access.guard';
import { CreateRecipeArgs, DeleteResult, Recipe, UpdateRecipeArgs } from './recipe.model';
import { RecipeService } from './recipe.service';

@Resolver(() => Recipe)
export class RecipeResolver {
  constructor(private readonly recipeService: RecipeService) {}

  @Query(() => Recipe)
  @UseGuards(JwtAccessGuard)
  async getRecipe(
    @Args('id') id: string,
  ): Promise<Recipe> {
    return this.recipeService.findById(id);
  }

  @Query(() => [Recipe])
  @UseGuards(JwtAccessGuard)
  async getRecipes(
    @JwtUserId() userId: string,
  ): Promise<Recipe[]> {
    return this.recipeService.find(userId);
  }

  @Mutation(() => Recipe)
  @UseGuards(JwtAccessGuard)
  async createRecipe(
    @JwtUserId() userId: string,
    @Args() args: CreateRecipeArgs,
  ): Promise<Recipe> {
    return this.recipeService.create(args, userId);
  }

  @Mutation(() => Recipe)
  @UseGuards(JwtAccessGuard)
  async updateRecipe(
    @Args('id') id: string,
    @Args() args: UpdateRecipeArgs,
  ): Promise<Recipe> {
    return this.recipeService.update(id, args);
  }

  @Mutation(() => DeleteResult)
  @UseGuards(JwtAccessGuard)
  async deleteRecipe(
    @Args('id') id: string,
  ): Promise<DeleteResult> {
    return this.recipeService.delete(id);
  }
}
