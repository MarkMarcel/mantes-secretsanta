import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Unsubscribe } from '@angular/fire/firestore';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RoutePaths } from 'src/app/app-routing.module';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { ExchangeService } from 'src/app/exchange/exchange.service';
import { PersonPlaceHolderUrl } from 'src/app/firebase-paths';
import { ImageType } from 'src/app/image/image.service';
import { UserService } from 'src/app/user/user.service';
import { CheckResultsComponent } from 'src/app/widgets/check-results/check-results.component';
import { ImageUploadComponent } from 'src/app/widgets/image-upload/image-upload.component';
import { SantaComponent } from 'src/app/widgets/santa/santa.component';
import { Child } from 'src/models/child';
import { Exchange } from 'src/models/exchange';
import { ImageUploadMeta } from 'src/models/image-upload-meta';
import { ItemWanted } from 'src/models/item-wanted';
import { AdminIds, User } from 'src/models/user';
import { UserExchange } from 'src/models/user-exchange';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  adminExchanges: Exchange[] = []
  assignedAdults: User[] = [];
  assignedChild: Child | null = null;
  exchanges: UserExchange[] = [];
  isAdmin = false;
  isAssigning = false;
  isLoading = true;
  isLoadingAdults = false;
  isLoadingChild = false;
  itemsWanted: ItemWanted[] = [];
  PersonPlaceHolderUrl = PersonPlaceHolderUrl;
  reloadRequired = false;
  selectedAdminExchange: Exchange | null | undefined = null;
  selectedExchange: UserExchange | null = null;
  setupUpdate = 'setup';
  year = (new Date()).getUTCFullYear().toString();
  unsubscribe: Unsubscribe | null = null;
  user: User | null = null;

  private _assigningDialogRef: MatDialogRef<SantaComponent> | null = null;
  private _dialogRef: Subscription | null = null;
  private _itemsWantedSubscription: Subscription | null = null;
  private _userSubscription: Subscription | null = null;

  constructor(
    private _authService: AuthenticationService,
    private _dialog: MatDialog,
    private _exchangeService: ExchangeService,
    private _router: Router,
    private _snackbar: MatSnackBar,
    private _userService: UserService,
  ) { }

  ngOnDestroy(): void {
    this._dialogRef?.unsubscribe();
    this._userSubscription?.unsubscribe();
    if (this.unsubscribe != null)
      this.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.checkUserRegistration();
  }

  onAddItemWanted() {
    this._router.navigate([RoutePaths.addItemWanted, this.selectedExchange!!.id]);
  }

  async onAssignPeople() {
    try {
      const assigned = await this._exchangeService.assignSecretSantas(this.selectedAdminExchange!!.id);
      if (!assigned) {
        this._assigningDialogRef?.close();
        this._snackbar.open('Failed to assign people');
      }else{
        this._dialog.open(CheckResultsComponent, { data: assigned })
      }
    } catch (error) {
      this._assigningDialogRef?.close();
      this._snackbar.open('Failed to assign people');
      console.log(error)
    }
  }

  onEditProfile() {
    this._router.navigate([RoutePaths.editProfile, this.user!!.id]);
  }

  onReviewExchangeDetails() {
    this._router.navigate([RoutePaths.setupExchange, this.selectedAdminExchange!!.id]);
  }

  onUpdateImage() {
    this._dialogRef?.unsubscribe();
    this._dialogRef = this._dialog.open<ImageUploadComponent, ImageUploadMeta, string>(ImageUploadComponent, { data: { id: this.user!!.id, type: ImageType.USER } }).afterClosed().subscribe((url) => {
      if (url) {
        this._userService.getUserDetails(this.user!!.id);
      }
    });
  }

  onSetupExchange() {
    this._router.navigate([RoutePaths.setupExchange]);
  }

  onSetSelectedExchange(exchange: UserExchange) {
    this.selectedExchange = exchange;
    this.setupSelectedExchange();
    this.resetExchangeData();
  }

  onSignOut() {
    this.isLoading = true;
    try {
      this._authService.signOut();
    } catch (e: any) {
      this._snackbar.open(`Failed to logout`);
    } finally {
      this.isLoading = false;
    }
  }

  private async checkUserRegistration() {
    const hasRegistered = await this._userService.getUserDetails(this._authService.auth.currentUser!!.uid)
    if (!hasRegistered)
      this._router.navigate([RoutePaths.profile])
    else {
      this.setup();
    }
  }

  private resetExchangeData() {
    this.assignedAdults = [];
    this.assignedChild = null;
    this.getAssignedAdults();
    this.getAssignedChild();
  }

  private async setup() {
    if (this.unsubscribe != null)
      this.unsubscribe();
    this._userService.user$.subscribe((user) => {
      this.user = user;
      this.isAdmin = AdminIds.includes(user!!.id);
    });
    this.exchanges = await this._exchangeService.getAllUserExchanges(this._authService.auth!!.currentUser!!.uid);
    this.determineSetupUpdate();
    this.selectedExchange = this.exchanges.find(exchange => (exchange.year == this.year)) ?? this.exchanges[0];
    if (this.isAdmin) {
      this.adminExchanges = await this._exchangeService.getAllExchanges();
    }
    this.isLoading = false;
    if (this.selectedExchange) this.setupSelectedExchange()
  }

  private async setupSelectedExchange() {
    if (this.isAdmin) {
      this.selectedAdminExchange = this.adminExchanges.find((exchange) => (exchange.id == this.selectedExchange!!.id));
    }
    if (this.unsubscribe != null)
      this.unsubscribe();
    this._itemsWantedSubscription?.unsubscribe();
    this.unsubscribe = this._exchangeService.observeExchange(this.selectedExchange!!.id, (isAssigning) => {
      if (this.isAssigning && !isAssigning) {
        this._snackbar.open('Successfull assigned everyone!!');
        this.setup();
      }
      this.isAssigning = isAssigning;
      if (isAssigning) {
        this._assigningDialogRef = this._dialog.open(SantaComponent);
      } else {
        this._assigningDialogRef?.close();
      }
    });
    this._itemsWantedSubscription = this._exchangeService.observeItemsWanted(this.selectedExchange!!.id, this.user!!.id).subscribe(items => {
      this.itemsWanted = items
    })
    this.getExchangeData();
  }

  private async getExchangeData() {
    this.getAssignedAdults();
    this.getAssignedChild();
  }

  private async getAssignedAdults() {
    this.isLoadingAdults = true;
    const exchange = this.selectedExchange as UserExchange
    if (exchange.assignedAdults.length > 0) {
      this.assignedAdults = await this._exchangeService.getUserExchangeAssignedAdults(exchange.assignedAdults);
    }
    this.isLoadingAdults = false;
  }

  private async getAssignedChild() {
    this.isLoadingChild = true;
    const exchange = this.selectedExchange as UserExchange
    if (exchange.assignedChild) {
      this.assignedChild = await this._exchangeService.getUserExchangeAssignedChild(exchange.assignedChild);
    }
    this.isLoadingChild = false;
  }

  private determineSetupUpdate() {
    const thisYearExchange = this.exchanges.find((exchange) => (exchange.year == this.year));
    if (thisYearExchange) {
      this.setupUpdate = 'update'
    }
  }
}
