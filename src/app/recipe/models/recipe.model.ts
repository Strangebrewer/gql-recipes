import { ArgsType, Directive, ObjectType } from '@nestjs/graphql';

// @Field() decorators are not required on these types — the @nestjs/graphql
// CLI plugin (configured in nest-cli.json) infers them automatically from
// files matching the .model.ts suffix.

@ObjectType()
@Directive('@key(fields: "id")')
export class Recipe {
  id: string;
  userId: string;
  name: string;
  ingredients: string[];
  directions: string[];
  description?: string;
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  tags?: string[];
  imageUrl?: string;
  macros?: string;
}

@ArgsType()
export class CreateRecipeArgs {
  name: string;
  ingredients: string[];
  directions: string[];
  description?: string;
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  tags?: string[];
  imageUrl?: string;
  macros?: string;
}

@ArgsType()
export class UpdateRecipeArgs {
  name?: string;
  ingredients?: string[];
  directions?: string[];
  description?: string;
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  tags?: string[];
  imageUrl?: string;
  macros?: string;
}
