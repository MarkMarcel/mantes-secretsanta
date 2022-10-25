import { Component, OnDestroy} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { ExchangeService } from 'src/app/exchange/exchange.service';
import { ItemPlaceHolderUrl } from 'src/app/firebase-paths';
import { ImageType } from 'src/app/image/image.service';
import { ImageUploadComponent } from 'src/app/widgets/image-upload/image-upload.component';
import { ImageUploadMeta } from 'src/models/image-upload-meta';
import { ItemWanted } from 'src/models/item-wanted';

enum State {
  FORM, REVIEW
}

@Component({
  selector: 'app-add-item-wanted',
  templateUrl: './add-item-wanted.component.html',
  styleUrls: ['./add-item-wanted.component.scss']
})
export class AddItemWantedComponent implements OnDestroy {
  docId = '';
  exchangeId = '';
  hasAnsweredHasPicture = false;
  hasAnsweredHasGoogleMapsLink = false;
  hasPicture = false;
  hasGoogleMapsUrl = false;
  isLoading = false;
  State = State;
  state = State.FORM;
  step = 1;
  itemForm = new FormGroup({
    name: new FormControl('', Validators.required),
    pictureUrl: new FormControl(''),
    googleMapsUrl: new FormControl('')
  });

  private _dialogRef: Subscription | null = null;
  private _routeSubscription: Subscription;

  constructor(
    private _authService: AuthenticationService,
    private _dialog: MatDialog,
    private _exchangeService: ExchangeService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _snackBar: MatSnackBar,
  ) {
    this._routeSubscription = this._route.paramMap.subscribe((paramMap:ParamMap) => {
        this.exchangeId = paramMap.get('exchangeId') as string;
        this.docId = _exchangeService.getIdForNewItemWanted(this.exchangeId, _authService.auth.currentUser!!.uid);
        console.log(this.exchangeId)
      });
  }

  ngOnDestroy(): void {
    this._dialogRef?.unsubscribe();
    this._routeSubscription.unsubscribe();
  }

  back() {
    this.hasAnsweredHasPicture = false;
    this.hasAnsweredHasGoogleMapsLink = false;
    this.hasPicture = false;
    this.hasGoogleMapsUrl = false;
    this.step = 1;
  }

  editForm() {
    this.hasAnsweredHasPicture = false;
    this.hasAnsweredHasGoogleMapsLink = false;
    this.hasPicture = false;
    this.hasGoogleMapsUrl = false;
    this.state = State.FORM;
  }

  nextQuestion() {
    this.step += 1;
  }

  review() {
    if (this.itemForm.valid) {
      this.state = State.REVIEW;
    } else {
      this._snackBar.open("Fix errors");
    }
  }

  async saveItemWanted() {
    this.isLoading = true;
    try {
      const item = this.createItemWanted();
      await this._exchangeService.saveItemWanted(item);
      this._router.navigate(['']);
    } catch (error) {
      this._snackBar.open("Failed to save item")
    }
  }

  setHasGoogleMapsUrl(hasGoogleMapsUrl: boolean) {
    this.hasAnsweredHasGoogleMapsLink = true;
    this.hasGoogleMapsUrl = hasGoogleMapsUrl;
  }

  setHasPicture(hasPicture: boolean) {
    this.hasAnsweredHasPicture = true;
    this.hasPicture = hasPicture;
    if (hasPicture) this.addPicture()
    else this.nextQuestion();
  }

  private addPicture() {
    this._dialogRef = this._dialog.open<ImageUploadComponent, ImageUploadMeta, string>(ImageUploadComponent, { data: { id: this.docId, type: ImageType.ITEM } }).afterClosed().subscribe((url) => {
      if (url) {
        this.itemForm.controls.pictureUrl.setValue(url);
        this.step++;
      }
    });
  }

  private createItemWanted(): ItemWanted {
    const picture = (this.itemForm.controls.pictureUrl.value!!.length > 0) ? this.itemForm.controls.pictureUrl.value!! : ItemPlaceHolderUrl;
    const googleMapsUrl = (this.itemForm.controls.googleMapsUrl.value!!.length > 0) ? this.itemForm.controls.googleMapsUrl.value!! : null;
    return new ItemWanted(this.docId, this.exchangeId, this._authService.auth.currentUser!!.uid, googleMapsUrl, this.itemForm.controls.name.value!!, picture);
  }

}
