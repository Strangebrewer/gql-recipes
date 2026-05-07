import { Test, TestingModule } from '@nestjs/testing';
import { MongoDBContainer, StartedMongoDBContainer } from '@testcontainers/mongodb';
import { Db, MongoClient } from 'mongodb';
import { RECIPE_COLLECTION } from '../src/common/factory/recipe.factory';
import { RecipeRepository } from '../src/app/recipe/recipe.repository';
import { RecipeService } from '../src/app/recipe/recipe.service';

describe('Recipe (integration)', () => {
  let container: StartedMongoDBContainer;
  let client: MongoClient;
  let db: Db;
  let module: TestingModule;
  let service: RecipeService;

  beforeAll(async () => {
    container = await new MongoDBContainer('mongo:6').start();
    client = await MongoClient.connect(container.getConnectionString(), { directConnection: true });
    db = client.db('test');

    module = await Test.createTestingModule({
      providers: [
        { provide: RECIPE_COLLECTION, useValue: db.collection('recipes') },
        RecipeRepository,
        RecipeService,
      ],
    }).compile();

    service = module.get<RecipeService>(RecipeService);
  }, 60000);

  afterAll(async () => {
    await module.close();
    await client.close();
    await container.stop();
  });

  afterEach(async () => {
    await db.collection('recipes').deleteMany({});
  });

  it('creates and retrieves a recipe', async () => {
    const userId = 'user-1';
    const created = await service.create(
      {
        name: 'Spaghetti Carbonara',
        ingredients: ['pasta', 'eggs', 'pancetta', 'pecorino', 'black pepper'],
        directions: ['Boil pasta', 'Fry pancetta', 'Mix eggs and cheese', 'Combine off heat'],
        prepTime: 10,
        cookTime: 20,
        servings: 4,
        tags: ['italian', 'pasta'],
      },
      userId,
    );

    expect(created.id).toBeDefined();
    expect(created.name).toBe('Spaghetti Carbonara');
    expect(created.ingredients).toEqual(['pasta', 'eggs', 'pancetta', 'pecorino', 'black pepper']);
    expect(created.directions).toHaveLength(4);
    expect(created.prepTime).toBe(10);
    expect(created.cookTime).toBe(20);
    expect(created.servings).toBe(4);
    expect(created.tags).toEqual(['italian', 'pasta']);
    expect(created.userId).toBe(userId);

    const found = await service.findById(created.id);
    expect(found).toEqual(created);
  });

  it('creates a recipe with only required fields', async () => {
    const created = await service.create(
      {
        name: 'Toast',
        ingredients: ['bread'],
        directions: ['Put bread in toaster', 'Wait'],
      },
      'user-1',
    );

    expect(created.id).toBeDefined();
    expect(created.name).toBe('Toast');
    expect(created.prepTime).toBeUndefined();
    expect(created.cookTime).toBeUndefined();
    expect(created.servings).toBeUndefined();
    expect(created.tags).toBeUndefined();
    expect(created.macros).toBeUndefined();
  });

  it('finds all recipes for a user', async () => {
    await service.create(
      { name: 'Recipe 1', ingredients: ['a'], directions: ['step 1'] },
      'user-1',
    );
    await service.create(
      { name: 'Recipe 2', ingredients: ['b'], directions: ['step 1'] },
      'user-1',
    );
    await service.create(
      { name: 'Recipe 3', ingredients: ['c'], directions: ['step 1'] },
      'user-2',
    );

    const results = await service.find('user-1');
    expect(results).toHaveLength(2);
  });

  it('updates a recipe', async () => {
    const created = await service.create(
      {
        name: 'Original Name',
        ingredients: ['a', 'b'],
        directions: ['step 1'],
        servings: 2,
      },
      'user-1',
    );

    const updated = await service.update(created.id, {
      name: 'Updated Name',
      servings: 4,
      macros: '400 cal, 20g protein',
    });

    expect(updated.name).toBe('Updated Name');
    expect(updated.servings).toBe(4);
    expect(updated.macros).toBe('400 cal, 20g protein');
    expect(updated.ingredients).toEqual(['a', 'b']);
  });

  it('deletes a recipe', async () => {
    const created = await service.create(
      { name: 'To Delete', ingredients: ['x'], directions: ['step 1'] },
      'user-1',
    );
    const result = await service.delete(created.id);
    expect(result.deletedCount).toBe(1);
  });

  it('throws when recipe not found', async () => {
    await expect(service.findById('nonexistent')).rejects.toThrow('Recipe not found');
  });
});
