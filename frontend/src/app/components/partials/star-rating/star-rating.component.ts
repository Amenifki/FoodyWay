import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.css'],
})
export class StarRatingComponent {
  @Input() stars: number = 0; // Number of stars
  @Input() maxStars: number = 5; // Maximum stars (usually 5)

  getFullStars(): number[] {
    return new Array(Math.floor(this.stars)); // Full stars
  }

  getHalfStars(): boolean {
    return this.stars % 1 !== 0; // Check if there's a half star
  }

  getEmptyStars(): number[] {
    return new Array(this.maxStars - Math.ceil(this.stars)); // Empty stars
  }
}
