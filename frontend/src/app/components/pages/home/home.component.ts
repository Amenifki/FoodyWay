import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FoodService } from 'src/app/services/food.service';
import { Food } from 'src/app/shared/models/Food';
import { UserService } from 'src/app/services/user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  foods: Food[] = [];
  isAdmin: boolean = false;

  constructor(
    private foodService: FoodService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    // Check if the user is an admin
    this.isAdmin = this.userService.isAdmin();

    let foodsObservable: Observable<Food[]>;

    // Subscribe to route params to determine the search or filter
    activatedRoute.params.subscribe((params) => {
      if (params.searchTerm) {
        foodsObservable = this.foodService.getAllFoodsBySearchTerm(
          params.searchTerm
        );
      } else if (params.tag) {
        foodsObservable = this.foodService.getAllFoodsByTag(params.tag);
      } else {
        foodsObservable = this.foodService.getAll();
      }

      // Update the food list when data is received
      foodsObservable.subscribe((serverFoods) => {
        this.foods = serverFoods;
      });
    });
  }

  ngOnInit(): void {}

  // Add New Product (Redirect to Add Product page)
  addNewProduct() {
    this.router.navigateByUrl('/add-product');
  }

  // Update Food (Redirect to Food Edit page)
  updateFood(foodId: string) {
    this.router.navigateByUrl(`/food/update/${foodId}`);
  }

  // Delete Food
  deleteFood(foodId: string) {
    if (confirm('Are you sure you want to delete this food item?')) {
      this.foodService.deleteFood(foodId).subscribe(
        () => {
          // Notify the user of successful deletion
          alert('Food deleted successfully!');

          // Reload the foods list from the server after deletion
          this.reloadFoods(); // Use loadFoods() to reload the list of foods
        },
        (error) => {
          // Handle any errors that occur during the deletion
          console.error('Error deleting food', error);
          alert('There was an error deleting the food item. Please try again.');
        }
      );
    }
  }
  // Reload the foods list (fetch from the server again)
  reloadFoods() {
    let foodsObservable: Observable<Food[]>;

    // Check for the current route params to reload accordingly
    this.activatedRoute.params.subscribe((params) => {
      if (params.searchTerm) {
        foodsObservable = this.foodService.getAllFoodsBySearchTerm(
          params.searchTerm
        );
      } else if (params.tag) {
        foodsObservable = this.foodService.getAllFoodsByTag(params.tag);
      } else {
        foodsObservable = this.foodService.getAll();
      }

      foodsObservable.subscribe((serverFoods) => {
        this.foods = serverFoods;
      });
    });
  }
  goToDetails(foodId: string) {
    this.router.navigateByUrl(`/food/${foodId}`);
  }
  toggleFavorite(food: Food, event: Event) {
    event.stopPropagation(); // Prevent triggering goToDetails()

    // Toggle the favorite status
    food.favorite = !food.favorite;

    // Update the food on the server
    this.foodService.updateFood(food.id, food).subscribe(() => {
      console.log(`Favorite status updated for ${food.name}`);
    });
  }
}
