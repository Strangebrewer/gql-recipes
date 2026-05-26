export type DatabaseConfig = {
  uri?: string;
  username: string;
  password: string;
  cluster: string;
  name: string;
  collections: {
    recipe: string;
  };
};

export default (): DatabaseConfig => ({
  uri: process.env.MONGO_URI || undefined,
  username: process.env.DB_USERNAME || '',
  password: process.env.DB_PASSWORD || '',
  cluster: process.env.DB_CLUSTER || '',
  name: process.env.DB_NAME || 'recipes',
  collections: {
    recipe: process.env.RECIPE_COLLECTION || 'recipes',
  },
});
