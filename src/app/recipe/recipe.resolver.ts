import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAccessGuard, JwtUserId } from '../../common/guards/jwt-access.guard';
import { TraceId } from '../../common/decorators/trace-id.decorator';
import { DeleteResult } from '../../common/models/common.model';
import { CreateRecipeArgs, Recipe, UpdateRecipeArgs } from './models/recipe.model';
import { RecipeService } from './recipe.service';

@Resolver(() => Recipe)
export class RecipeResolver {
  constructor(private readonly recipeService: RecipeService) {}

  @Query(() => Recipe)
  @UseGuards(JwtAccessGuard)
  async getRecipe(
    @TraceId() traceId: string,
    @Args('id') id: string,
  ): Promise<Recipe> {
    return this.recipeService.findById(id, traceId);
  }

  @Query(() => [Recipe])
  @UseGuards(JwtAccessGuard)
  async getRecipes(
    @TraceId() traceId: string,
    @JwtUserId() userId: string,
  ): Promise<Recipe[]> {
    return this.recipeService.find(userId, traceId);
  }

  @Mutation(() => Recipe)
  @UseGuards(JwtAccessGuard)
  async createRecipe(
    @TraceId() traceId: string,
    @JwtUserId() userId: string,
    @Args() args: CreateRecipeArgs,
  ): Promise<Recipe> {
    return this.recipeService.create(args, userId, traceId);
  }

  @Mutation(() => Recipe)
  @UseGuards(JwtAccessGuard)
  async updateRecipe(
    @TraceId() traceId: string,
    @Args('id') id: string,
    @Args() args: UpdateRecipeArgs,
  ): Promise<Recipe> {
    return this.recipeService.update(id, args, traceId);
  }

  @Mutation(() => DeleteResult)
  @UseGuards(JwtAccessGuard)
  async deleteRecipe(
    @TraceId() traceId: string,
    @Args('id') id: string,
  ): Promise<DeleteResult> {
    return this.recipeService.delete(id, traceId);
  }
}
