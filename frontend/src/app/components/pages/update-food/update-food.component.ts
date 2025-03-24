import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FoodService } from 'src/app/services/food.service';
import { Food } from 'src/app/shared/models/Food';

@Component({
  selector: 'app-update-food',
  templateUrl: './update-food.component.html',
  styleUrls: ['./update-food.component.css'],
})
export class UpdateFoodComponent implements OnInit {
  food: Food = {
    id: '',
    name: '',
    price: 0,
    tags: [],
    favorite: false,
    stars: 0,
    imageUrl: '',
    origins: [],
    cookTime: '',
  };
  tags: string = '';

  constructor(
    private foodService: FoodService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 🔹 Correction : utiliser 'id' et non 'foodId'
    this.activatedRoute.params.subscribe((params) => {
      const foodId = params['id']; // Doit correspondre à 'food/update/:id' dans AppRoutingModule

      if (foodId) {
        this.foodService.getFoodById(foodId).subscribe((serverFood) => {
          if (serverFood) {
            this.food = serverFood;
            // this.tags = serverFood.tags.join(', '); // Convertir tags en string pour l'input
          }
        });
      }
    });
  }

  updateFood() {
    if (!this.food.name || this.food.price <= 0) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    this.food.tags = this.tags.split(',').map((tag) => tag.trim());

    this.foodService.updateFood(this.food.id, this.food).subscribe(
      () => {
        alert('Produit mis à jour avec succès !');
        this.router.navigate(['/']); // 🔹 Utilisation de navigate() au lieu de navigateByUrl('/')
      },
      (error) => {
        console.error('Erreur mise à jour :', error);
        alert(
          'Erreur : mise à jour impossible ! Vérifiez que le serveur est actif.'
        );
      }
    );
  }

  cancelUpdate() {
    this.router.navigateByUrl('/');
  }
}
