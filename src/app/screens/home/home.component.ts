import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.checkUserRegistration()
  }

  private async checkUserRegistration() {
    const hasRegistered = await this.userService.getUserDetails(this.authService.auth.currentUser!!.uid)
    if (!hasRegistered)
      this.router.navigate(['profile'])
  }
}
