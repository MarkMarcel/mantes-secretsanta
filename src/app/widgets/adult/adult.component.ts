import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/models/user';

@Component({
  selector: 'app-adult',
  templateUrl: './adult.component.html',
  styleUrls: ['./adult.component.scss']
})
export class AdultComponent {
  @Input()adult: User | null = null;

  constructor() { }

}
