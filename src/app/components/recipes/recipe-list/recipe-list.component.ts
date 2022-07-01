import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
// *
import { RecipeService } from "src/app/services/recipe.service";
import { Recipe } from "../../../shared/recipe.model";

@Component({
  selector: "app-recipe-list",
  templateUrl: "./recipe-list.component.html",
  styleUrls: ["./recipe-list.component.css"],
})
export class RecipeListComponent implements OnInit {
  public recipes: Recipe[] = [];
  private _recipeSub: Subscription;

  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this._recipeSub = this.recipeService.recipesChanged.subscribe(
      (val: Recipe[]) => {
        this.recipes = val;
      }
    );
    this.recipes = this.recipeService.getRecipes();
  }

  public onNewRecipe() {
    this.router.navigate(["new"], { relativeTo: this.route });
  }
}
