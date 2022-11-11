import { AfterViewInit, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { ExchangeService } from 'src/app/exchange/exchange.service';
import { ItemWanted } from 'src/models/item-wanted';
import { User } from 'src/models/user';
import { ImageUploadComponent } from '../image-upload/image-upload.component';

export interface ItemsWantedFetchInfo{
  exchangeId:string,
  user:User,
}

@Component({
  selector: 'app-items-wanted',
  templateUrl: './items-wanted.component.html',
  styleUrls: ['./items-wanted.component.scss']
})
export class ItemsWantedComponent implements AfterViewInit,OnDestroy {
  isLoading = true;
  itemsWanted:ItemWanted[] = [];
  name = '';

  private _itemsWantedSubscription:Subscription|null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: ItemsWantedFetchInfo,
    private _dialog: MatDialogRef<ImageUploadComponent>,
    private _exchangeService:ExchangeService,
  ) { 
    this.name = _data.user.name;
  }

  ngAfterViewInit(): void {
    this._itemsWantedSubscription = this._exchangeService.observeItemsWanted(this._data.exchangeId,this._data.user.id).subscribe(items => {
      this.itemsWanted = items;
      this.isLoading = false;
    })
  }
  
  ngOnDestroy(): void {
    this._itemsWantedSubscription?.unsubscribe();
  }

  close(){
    this._dialog.close();
  }  

}
