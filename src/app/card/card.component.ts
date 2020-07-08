import {
	Component,
	OnInit,
	Input,
	ChangeDetectorRef,
	HostListener,
} from '@angular/core';
import { PlayerDataService } from '../services/player-data.service';
import { PropertyWildCard } from './../classes/property-wild-card';
import { PropertyCard } from './../classes/property-card';
import { CardColorsService } from './../services/card-colors.service';
import { Card, CardType } from '../classes/card';

@Component({
	selector: 'mc-card',
	templateUrl: './card.component.html',
	styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
	@Input() public config: Card;
	@Input() public valueRotate = false;

	@HostListener('mouseleave', ['$event']) onmouseout(event: MouseEvent) {
		this.toggleCardClick = false;
		this.cd.detectChanges();
	}

	public showInfo = false;
	public clicked = false;
	public toggleCardClick = false;
	public readonly CardType = CardType;

	constructor(
		private cardColor: CardColorsService,
		private playerService: PlayerDataService,
		private cd: ChangeDetectorRef
	) {}

	ngOnInit() {}

	toggleInfo(event: Event) {
		event.stopImmediatePropagation();
		this.showInfo = !this.showInfo;
		this.cd.detectChanges();
	}

	valueColor(top: boolean): string {
		if (this.config.type === CardType.PROPERTY) {
			return this.cardColor.getColor((this.config as PropertyCard).set);
		} else {
			if (this.config.type === CardType.PROPERTYWILD) {
				const property = this.config as PropertyWildCard;
				if (top) {
					return this.cardColor.getColor(property.propertyA.set);
				} else {
					return this.cardColor.getColor(property.propertyB.set);
				}
			} else {
				return this.config.bgColor;
			}
		}
	}

	valueTextColor(top: boolean): string {
		if (this.config.type === CardType.PROPERTYWILD) {
			return top
				? (this.config as PropertyWildCard).propertyA.textColor
				: (this.config as PropertyWildCard).propertyB.textColor;
		}

		if (this.config.type === CardType.PROPERTY) {
			return (this.config as PropertyCard).textColor;
		}
	}

	moveMoney() {
		this.playerService.moveMoney(this.config.id);
		this.cd.detectChanges();
	}

	moveTable() {
		this.playerService.moveTable(this.config.id);
		this.cd.detectChanges();
	}

	movePile() {
		this.playerService.movePile(this.config.id);
		this.cd.detectChanges();
	}

	toggleCard() {
		this.toggleCardClick = !this.toggleCardClick;
		this.cd.detectChanges();
	}
}
