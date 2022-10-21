import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Unsubscribe } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { ExchangeService } from 'src/app/exchange/exchange.service';
import { UserService } from 'src/app/user/user.service';
import { Child } from 'src/models/child';
import { Exchange } from 'src/models/exchange';
import { User } from 'src/models/user';
import { UserExchange } from 'src/models/user-exchange';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  assignedAdults:User[] = []; 
  assignedChild:Child|null = null;
  exchanges: UserExchange[] = [];
  isLoading = true;
  isLoadingAdults = false;
  isLoadingChild = false;
  reloadRequired = false;
  selectedExchange: Exchange | UserExchange | null = null;
  unsubscribe: Unsubscribe | null = null;


  constructor(
    private authService: AuthenticationService,
    private exchangeService: ExchangeService,
    private router: Router,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.checkUserRegistration();
  }

  setExchange(exchange: Exchange | UserExchange) {
    this.selectedExchange = exchange;
    if (this.unsubscribe != null)
      this.unsubscribe();
    this.exchangeService.observeExchange(exchange.id, (isAssigning) => { this.isLoading = isAssigning; });
  }

  private async checkUserRegistration() {
    const hasRegistered = await this.userService.getUserDetails(this.authService.auth.currentUser!!.uid)
    if (!hasRegistered)
      this.router.navigate(['profile'])
    else {
      this.setup();
    }
  }

  private async setup() {
    this.exchanges = await this.exchangeService.getAllUserExchanges(this.authService.auth!!.currentUser!!.uid);
    const thisYear = (new Date()).getUTCFullYear().toString();
    this.selectedExchange = this.exchanges.find(exchange => (exchange.year == thisYear)) ?? this.exchanges[0];
    this.isLoading = false;
    this.getAssignedAdults();
    if(this.selectedExchange.assignedChild) this.getAssignedChild();
  }

  private async getAssignedAdults(){
    this.isLoadingAdults = true;
    this.assignedAdults = await this.exchangeService.getUserExchangeAssignedAdults(this.selectedExchange as UserExchange);
    this.isLoadingAdults = false;
  }

  private async getAssignedChild(){
    this.isLoadingChild = true;
    this.assignedChild = await this.exchangeService.getUserExchangeAssignedChild(this.selectedExchange as UserExchange);
    this.isLoadingChild = false;
  }
}
