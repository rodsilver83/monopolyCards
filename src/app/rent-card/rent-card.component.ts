import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CardColorsService } from '../services/card-colors.service';
import { RentCard } from '../classes/rent-card';

@Component({
  selector: 'app-rent-card',
  templateUrl: './rent-card.component.html',
  styleUrls: ['./rent-card.component.scss']
})
export class RentCardComponent implements OnInit {

  @Input() public config: RentCard;

  get backgroundColor() {
    if (!this.config.wild) {
      return this.sanitizer.bypassSecurityTrustStyle(`linear-gradient(to bottom,
      ${this.cardColor.getColor(this.config.rentSet1)} 0%,
      ${this.cardColor.getColor(this.config.rentSet1)} 50%,
      ${this.cardColor.getColor(this.config.rentSet2)} 50%,
      ${this.cardColor.getColor(this.config.rentSet2)} 100%)`);
    } else {
      return this.cardColor.getRainbowLinearGradient('bottom');
    }
  }

  constructor(private sanitizer: DomSanitizer, private cardColor: CardColorsService) { }

  ngOnInit() {
  }

}
