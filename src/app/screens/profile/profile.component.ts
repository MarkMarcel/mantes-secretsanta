import { Component, OnInit } from '@angular/core';
import { Child } from 'src/models/child';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  children = [new Child("dfdf","Ellis"),new Child("dfdfe","Nhyira"),]

  constructor() { }

  ngOnInit(): void {
  }

}
