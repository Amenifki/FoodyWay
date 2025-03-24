import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FoodService } from 'src/app/services/food.service';
import { Food } from 'src/app/shared/models/Food';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent implements OnInit {
  foodForm: FormGroup;

  constructor(
    private foodService: FoodService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.foodForm = this.formBuilder.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      tags: ['', Validators.required],
      favorite: [false],
      stars: ['', [Validators.required, Validators.min(0), Validators.max(5)]],
      imageUrl: ['', Validators.required],
      origins: ['', Validators.required],
      cookTime: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  // Method to submit the form
  onSubmit(): void {
    if (this.foodForm.invalid) {
      return;
    }

    const newFood: Food = this.foodForm.value;
    this.foodService.addFood(newFood).subscribe(
      (response) => {
        alert('Food added successfully!');
        this.router.navigateByUrl('/'); // Redirect to home or food list page
      },
      (error) => {
        console.error('Error adding food', error);
        alert('There was an error adding the food item. Please try again.');
      }
    );
  }
}
