import { Injectable } from '@nestjs/common';
import { RecipeService } from '../recipe/recipe.service';

@Injectable()
export class DemoService {
  constructor(private readonly recipeService: RecipeService) {}

  async seedDemoData(userId: string, expiresAt: Date): Promise<void> {
    const opts = { expiresAt };

    await Promise.all([
      this.recipeService.create(
        {
          name: 'Spaghetti Carbonara',
          ingredients: [
            '400g spaghetti',
            '200g guanciale or pancetta',
            '4 large eggs',
            '100g Pecorino Romano, grated',
            '50g Parmesan, grated',
            'Freshly ground black pepper',
            'Salt',
          ],
          directions: [
            'Bring a large pot of salted water to boil and cook spaghetti until al dente.',
            'Fry guanciale in a large pan over medium heat until crispy. Remove from heat.',
            'Whisk together eggs, Pecorino, Parmesan, and a generous amount of black pepper.',
            'Reserve 1 cup pasta water, then drain. Working quickly, add pasta to pan with guanciale.',
            'Remove from heat and pour egg mixture over pasta, tossing constantly and adding pasta water as needed to create a creamy sauce.',
            'Serve immediately with extra cheese and black pepper.',
          ],
          prepTime: 10,
          cookTime: 20,
          servings: 4,
          tags: ['italian', 'pasta'],
        },
        userId,
        opts,
      ),
      this.recipeService.create(
        {
          name: 'Chicken Stir Fry',
          ingredients: [
            '500g chicken breast, thinly sliced',
            '2 cups broccoli florets',
            '1 red bell pepper, sliced',
            '2 cloves garlic, minced',
            '1 tbsp fresh ginger, grated',
            '3 tbsp soy sauce',
            '1 tbsp oyster sauce',
            '1 tsp sesame oil',
            '2 tbsp vegetable oil',
            'Sesame seeds to garnish',
          ],
          directions: [
            'Mix soy sauce, oyster sauce, and sesame oil in a small bowl.',
            'Heat vegetable oil in a wok or large pan over high heat.',
            'Cook chicken until golden, about 5 minutes. Set aside.',
            'Stir fry garlic and ginger for 30 seconds, then add broccoli and bell pepper.',
            'Return chicken to pan, pour in sauce, and toss to combine.',
            'Cook 2 more minutes until vegetables are tender-crisp. Garnish with sesame seeds and serve over rice.',
          ],
          prepTime: 15,
          cookTime: 15,
          servings: 3,
          tags: ['asian', 'quick'],
        },
        userId,
        opts,
      ),
      this.recipeService.create(
        {
          name: 'Banana Bread',
          ingredients: [
            '3 ripe bananas, mashed',
            '1/3 cup melted butter',
            '3/4 cup sugar',
            '1 egg, beaten',
            '1 tsp vanilla extract',
            '1 tsp baking soda',
            'Pinch of salt',
            '1.5 cups all-purpose flour',
            '1/2 cup walnuts, chopped (optional)',
          ],
          directions: [
            'Preheat oven to 350°F (175°C). Grease a 4x8 inch loaf pan.',
            'Mix melted butter into mashed bananas.',
            'Mix in sugar, beaten egg, and vanilla.',
            'Sprinkle in baking soda and salt and stir to combine.',
            'Add flour and mix until just combined. Fold in walnuts if using.',
            'Pour batter into prepared pan and bake 55-65 minutes until a toothpick inserted in the center comes out clean.',
            'Cool on a rack before slicing.',
          ],
          prepTime: 15,
          cookTime: 60,
          servings: 8,
          tags: ['baking', 'breakfast'],
        },
        userId,
        opts,
      ),
    ]);
  }
}
