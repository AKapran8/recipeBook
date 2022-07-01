import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Subscription } from "rxjs";

import { RecipeService } from "src/app/services/recipe.service";
import { Recipe } from "../../../shared/recipe.model";

@Component({
  selector: "app-recipe-detail",
  templateUrl: "./recipe-detail.component.html",
  styleUrls: ["./recipe-detail.component.css"],
})
export class RecipeDetailComponent implements OnInit, OnDestroy {
  public recipe: Recipe;
  public id: number;

  private _routerSub: Subscription | null = null;
  constructor(
    private recipeService: RecipeService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this._routerSub = this._route.params.subscribe((val: Params) => {
      this.id = +val["id"];
      this.recipe = this.recipeService.getRecipeById(this.id);
    });
  }

  public addToShoppingList() {
    this.recipeService.addingredientsToShoppingList(this.recipe.ingredients);
  }

  public onEditRecipe() {
    this._router.navigate(["../", this.id, "edit"], {
      relativeTo: this._route,
    });
  }
  public onDeleteRecipe() {
    this.recipeService.deleteRecipe(this.id);
    this._router.navigate(["/recipes"]);
  }

  ngOnDestroy() {
    this._routerSub?.unsubscribe();
  }
}
