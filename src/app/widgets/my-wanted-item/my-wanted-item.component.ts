import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExchangeService } from 'src/app/exchange/exchange.service';
import { ItemWanted } from 'src/models/item-wanted';

@Component({
  selector: 'app-my-wanted-item',
  templateUrl: './my-wanted-item.component.html',
  styleUrls: ['./my-wanted-item.component.scss']
})
export class MyWantedItemComponent {
  @Input() item: ItemWanted | null = null;

  constructor(
    private _exchangeService: ExchangeService,
    private _snackbar: MatSnackBar,
  ) { }

  async deleteItem() {
    try {
      await this._exchangeService.deleteItemWanted(this.item!!.exchangeId, this.item!!.id, this.item!!.userId);
    } catch (error) {
      this._snackbar.open("Couldn't delete item");
    }
  }
}
