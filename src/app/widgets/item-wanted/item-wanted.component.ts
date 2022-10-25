import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExchangeService } from 'src/app/exchange/exchange.service';
import { ItemWanted } from 'src/models/item-wanted';

@Component({
  selector: 'app-item-wanted',
  templateUrl: './item-wanted.component.html',
  styleUrls: ['./item-wanted.component.scss']
})
export class ItemWantedComponent {
  @Input() item: ItemWanted | null = null;

  constructor(
    private _exchangeService:ExchangeService,
    private _snackbar: MatSnackBar,
    ) { }

  async setPurchased(){
    try {
      await this._exchangeService.setItemWantedPurchased(this.item!!)
      this._snackbar.open('Successfully indicated item purchased');
    } catch (error) {
      this._snackbar.open("Failed to indicate purchased");
    }
  }

}
