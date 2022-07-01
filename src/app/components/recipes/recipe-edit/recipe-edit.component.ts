import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { RecipeService } from "src/app/services/recipe.service";
import { Recipe } from "src/app/shared/recipe.model";

@Component({
  selector: "app-recipe-edit",
  templateUrl: "./recipe-edit.component.html",
  styleUrls: ["./recipe-edit.component.css"],
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  public id: number;
  public isEditMode: boolean = false;
  recipeForm: FormGroup;

  private _routeSub: Subscription | null = null;

  constructor(
    private _route: ActivatedRoute,
    private recipeService: RecipeService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this._routeSub = this._route.params.subscribe((val: Params) => {
      this.id = +val["id"];
      this.isEditMode = val["id"] != null;
      this._initForm();
    });
  }
  get controls() {
    return (<FormArray>this.recipeForm.get("ingredients")).controls;
  }
  public onSubmit() {
    const val = this.recipeForm.value;
    const newRecipe = new Recipe(
      val["name"],
      val["descr"],
      val["imagePath"],
      val["ingredients"]
    );

    if (this.isEditMode) {
      this.recipeService.updateRecipe(this.id, newRecipe);
    } else {
      this.recipeService.addRecipe(newRecipe);
    }
    this.onCancel();
  }

  private _initForm() {
    let recipeName = "";
    let recipeImagePath = "";
    let recipeDescr = "";
    let recipeIngredients = new FormArray([]);

    if (this.isEditMode) {
      let recipe = this.recipeService.getRecipeById(this.id);
      recipeName = recipe.name;
      recipeImagePath = recipe.imagePath;
      recipeDescr = recipe.description;
      if (recipe["ingredients"]) {
        for (let ingredient of recipe.ingredients) {
          recipeIngredients.push(
            new FormGroup({
              name: new FormControl(ingredient.name, Validators.required),
              amount: new FormControl(ingredient.amount, [
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/),
              ]),
            })
          );
        }
      }
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      imagePath: new FormControl(recipeImagePath, Validators.required),
      descr: new FormControl(recipeDescr, Validators.required),
      ingredients: recipeIngredients,
    });
  }

  public onAddIngredient() {
    (<FormArray>this.recipeForm.get("ingredients")).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/),
        ]),
      })
    );
  }

  public onCancel() {
    this._router.navigate(["../"], { relativeTo: this._route });
  }

  public onDeleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get("ingredients")).removeAt(index);
  }

  ngOnDestroy() {
    this._routeSub?.unsubscribe();
  }
}
