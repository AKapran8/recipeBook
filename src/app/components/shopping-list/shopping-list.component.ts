import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { ShoppingListService } from "src/app/services/shopping-list.service";
// *
import { Ingredient } from "src/app/shared/ingredient.model";

@Component({
  selector: "app-shopping-list",
  templateUrl: "./shopping-list.component.html",
  styleUrls: ["./shopping-list.component.css"],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  public ingredients: Ingredient[] = [];

  private _shoppingListSub: Subscription | null = null;
  constructor(private shoppingListService: ShoppingListService) {}

  ngOnInit(): void {
    this.ingredients = this.shoppingListService.getIngredients();
    this._shoppingListSub =
      this.shoppingListService.ingredientsChangedSub.subscribe(
        (value: Ingredient[]) => {
          this.ingredients = value;
        }
      );
  }

  public onEditItem(index: number) {
    this.shoppingListService.startEditing.next(index);
  }

  ngOnDestroy() {
    this._shoppingListSub?.unsubscribe();
  }
}
