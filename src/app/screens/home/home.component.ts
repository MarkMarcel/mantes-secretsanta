import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Unsubscribe } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { ExchangeService } from 'src/app/exchange/exchange.service';
import { PersonPlaceHolderUrl } from 'src/app/firebase-paths';
import { ImageType } from 'src/app/image/image.service';
import { UserService } from 'src/app/user/user.service';
import { ImageUploadComponent } from 'src/app/widgets/image-upload/image-upload.component';
import { Child } from 'src/models/child';
import { Exchange } from 'src/models/exchange';
import { ImageUploadMeta } from 'src/models/image-upload-meta';
import { AdminIds, User } from 'src/models/user';
import { UserExchange } from 'src/models/user-exchange';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  admins = AdminIds;
  assignedAdults: User[] = [];
  assignedChild: Child | null = null;
  exchanges: UserExchange[] = [];
  isLoading = true;
  isLoadingAdults = false;
  isLoadingChild = false;
  PersonPlaceHolderUrl = PersonPlaceHolderUrl;
  reloadRequired = false;
  selectedExchange: Exchange | UserExchange | null = null;
  setupUpdate = 'setup';
  year = (new Date()).getUTCFullYear().toString();
  unsubscribe: Unsubscribe | null = null;
  user: User | null = null;

  private _dialogRef: Subscription | null = null;
  private _userSubscription: Subscription | null = null;

  constructor(
    private _authService: AuthenticationService,
    private _dialog: MatDialog,
    private _exchangeService: ExchangeService,
    private _router: Router,
    private _snackbar:MatSnackBar,
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

  onUpdateImage() {
    this._dialogRef?.unsubscribe();
    this._dialogRef = this._dialog.open<ImageUploadComponent, ImageUploadMeta, string>(ImageUploadComponent, { data: { id: this.user!!.id, type: ImageType.USER } }).afterClosed().subscribe((url) => {
      if (url) {
        this._userService.getUserDetails(this.user!!.id);
      }
    });
  }

  onSetupExchange(){
    this._router.navigate(['/setup-exchange']);
  }

  onSetSelectedExchange(exchange: Exchange | UserExchange) {
    this.selectedExchange = exchange;
    if (this.unsubscribe != null)
      this.unsubscribe();
    this._exchangeService.observeExchange(exchange.id, (isAssigning) => { this.isLoading = isAssigning; });
  }

  onSignOut(){
    this.isLoading = true;
    try{
      this._authService.signOut();
    }catch(e:any){
      this._snackbar.open(`Couldn't logout`);
    }finally{
      this.isLoading = false;
    }
  }

  private async checkUserRegistration() {
    const hasRegistered = await this._userService.getUserDetails(this._authService.auth.currentUser!!.uid)
    if (!hasRegistered)
      this._router.navigate(['profile'])
    else {
      this.setup();
    }
  }

  private async setup() {
    this._userService.user$.subscribe((user) => {
      console.log("id",user?.id)
      this.user = user;
    });
    this.exchanges = await this._exchangeService.getAllUserExchanges(this._authService.auth!!.currentUser!!.uid);
    this.determineSetupUpdate();
    this.selectedExchange = this.exchanges.find(exchange => (exchange.year == this.year)) ?? this.exchanges[0];
    this.isLoading = false;
    this.getAssignedAdults();
    if (this.selectedExchange.assignedChild) this.getAssignedChild();
  }

  private async getAssignedAdults() {
    this.isLoadingAdults = true;
    this.assignedAdults = await this._exchangeService.getUserExchangeAssignedAdults(this.selectedExchange as UserExchange);
    this.isLoadingAdults = false;
  }

  private async getAssignedChild() {
    this.isLoadingChild = true;
    this.assignedChild = await this._exchangeService.getUserExchangeAssignedChild(this.selectedExchange as UserExchange);
    this.isLoadingChild = false;
  }

  private determineSetupUpdate(){
    const thisYearExchange = this.exchanges.find((exchange) => (exchange.year == this.year));
    if(thisYearExchange){
      this.setupUpdate = 'update'
    }
  }
}
