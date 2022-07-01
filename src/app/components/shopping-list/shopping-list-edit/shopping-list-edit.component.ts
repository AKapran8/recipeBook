import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
// *
import { ShoppingListService } from "src/app/services/shopping-list.service";
import { Ingredient } from "src/app/shared/ingredient.model";

@Component({
  selector: "app-shopping-list-edit",
  templateUrl: "./shopping-list-edit.component.html",
  styleUrls: ["./shopping-list-edit.component.css"],
})
export class ShoppingListEditComponent implements OnInit, OnDestroy {
  @ViewChild("f") slForm: NgForm;

  public editingItemIndex: number;
  public isEditMode: boolean = false;
  private _editingSub: Subscription;
  public editedItem: Ingredient;

  constructor(private shoppingListService: ShoppingListService) {}

  ngOnInit(): void {
    this._editingSub = this.shoppingListService.startEditing.subscribe(
      (val: number) => {
        this.editingItemIndex = val;
        this.isEditMode = true;
        this.editedItem = this.shoppingListService.getIngredient(val);
        this.slForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount,
        });
      }
    );
  }

  onSubmitProduct(form: NgForm) {
    const newIngredient = new Ingredient(form.value.name, form.value.amount);
    if (this.isEditMode) {
      this.shoppingListService.updateIndredient(
        this.editingItemIndex,
        newIngredient
      );
    } else {
      this.shoppingListService.addIngredient(newIngredient);
    }
    this.isEditMode = false;
    form.reset();
  }
  public onDelete() {
    this.shoppingListService.deleteIngredient(this.editingItemIndex);
    this.onClear();
  }

  public onClear() {
    this.slForm.reset();
    this.isEditMode = false;
  }

  ngOnDestroy() {
    this._editingSub.unsubscribe();
  }
}
