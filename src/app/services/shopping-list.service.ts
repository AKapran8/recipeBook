import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

import { Ingredient } from "../shared/ingredient.model";

@Injectable({
  providedIn: "root",
})
export class ShoppingListService {
  private _ingredients: Ingredient[] = [];

  public ingredientsChangedSub = new Subject<Ingredient[]>();
  public startEditing = new Subject<number>();

  constructor() {}

  public getIngredients() {
    return this._ingredients.slice();
  }

  public getIngredient(index: number) {
    return this._ingredients[index];
  }

  public addIngredient(ingredient: Ingredient) {
    this._ingredients.push(ingredient);
    this.ingredientsChangedSub.next(this._ingredients.slice());
  }

  public addIngredients(ingredients: Ingredient[]) {
    for (let i = 0; i < ingredients.length; i++) {
      const newArray = [...this._ingredients];
      newArray.push(ingredients[i]);
      this._ingredients = newArray;
    }
    this.getIngredients();
  }

  public updateIndredient(index: number, newIngredient: Ingredient) {
    this._ingredients[index] = newIngredient;
    this.ingredientsChangedSub.next(this._ingredients.slice());
  }

  public deleteIngredient(index: number) {
    this._ingredients.splice(index, 1);
    this.ingredientsChangedSub.next(this._ingredients.slice());
  }
}
