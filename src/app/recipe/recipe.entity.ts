export type RecipeEntity = {
  id: string;
  thing: string;
  userId: string;
};

export type RecipeEntityRead = RecipeEntity & {
  _id?: string;
};
