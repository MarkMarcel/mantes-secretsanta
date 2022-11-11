import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/models/user';
import { ItemsWantedComponent, ItemsWantedFetchInfo } from '../items-wanted/items-wanted.component';

@Component({
  selector: 'app-adult',
  templateUrl: './adult.component.html',
  styleUrls: ['./adult.component.scss']
})
export class AdultComponent {
  @Input() adult: User | null = null;
  @Input() exchangeId: string = '';

  constructor(
    private _dialog: MatDialog,
  ) { }

  seeItemsWanted() {
    this._dialog.open<ItemsWantedComponent, ItemsWantedFetchInfo>(ItemsWantedComponent, { data: { exchangeId: this.exchangeId, user: this.adult!! } })
  }

}
