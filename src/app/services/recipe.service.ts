import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

import { Ingredient } from "../shared/ingredient.model";
import { Recipe } from "../shared/recipe.model";
import { ShoppingListService } from "./shopping-list.service";

@Injectable({
  providedIn: "root",
})
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();
  private _recipes: Recipe[] = [
    new Recipe(
      "A test Recipe",
      "this is a descr",
      "https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/courgette_pakoras_83738_16x9.jpg",
      [new Ingredient("Potato", 10), new Ingredient("Bread", 5)]
    ),
    new Recipe(
      "A test Recipe",
      "this is a descr",
      "https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/courgette_pakoras_83738_16x9.jpg",
      [new Ingredient("tomato", 3), new Ingredient("Banana", 8)]
    ),
  ];

  constructor(private slService: ShoppingListService) {}

  public getRecipes() {
    return this._recipes.slice();
  }

  public getRecipeById(id: number) {
    return this._recipes[id];
  }

  public addingredientsToShoppingList(ingredients: Ingredient[]) {
    return this.slService.addIngredients(ingredients);
  }

  public addRecipe(recipe: Recipe) {
    this._recipes.push(recipe);
    this.recipesChanged.next(this._recipes.slice());
  }

  public updateRecipe(index: number, newRecipe: Recipe) {
    this._recipes[index] = newRecipe;
    this.recipesChanged.next(this._recipes.slice());
  }

  public deleteRecipe(index: number) {
    this._recipes.splice(index, 1);
    this.recipesChanged.next(this._recipes.slice());
  }
}
