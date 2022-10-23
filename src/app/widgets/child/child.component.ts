import { Component, Input, OnInit } from '@angular/core';
import { ImageType } from 'src/app/image/image.service';
import { Child } from 'src/models/child';

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.scss']
})
export class ChildComponent implements OnInit {
  @Input() child:Child|null = null
  ImageType = ImageType

  constructor() { }

  ngOnInit(): void {
  }

}
