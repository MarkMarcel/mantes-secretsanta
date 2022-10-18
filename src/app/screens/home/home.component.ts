import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit,AfterViewInit {

  constructor(private auth:AuthenticationService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    
  }

}
