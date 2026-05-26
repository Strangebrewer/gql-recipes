export type RecipeEntity = {
  _id: string;
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
  expiresAt?: Date;
};
