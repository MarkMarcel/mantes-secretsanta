import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ImageType } from 'src/app/image/image.service';
import { Child } from 'src/models/child';
import { ImageUploadMeta } from 'src/models/image-upload-meta';
import { ImageUploadComponent } from '../image-upload/image-upload.component';

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.scss']
})
export class ChildComponent implements OnInit, OnDestroy {
  @Input() child:Child|null = null 
  pictureUrl: string = ''
  @Output() url = new EventEmitter<string>();

  private _dialogRef: Subscription | null = null;

  constructor(
    private _dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.pictureUrl = this.child!!.pictureUrl;
  }

  ngOnDestroy(): void {
    this._dialogRef?.unsubscribe();
  }

  onUpdateImage() {
    this._dialogRef?.unsubscribe();
    this._dialogRef = this._dialog.open<ImageUploadComponent, ImageUploadMeta, string>(ImageUploadComponent,{data:{id:this.child!!.id,type:ImageType.CHILD}}).afterClosed().subscribe((url) => {
      if (url) {
        this.pictureUrl = url;
        this.url.emit(url);
      }
    });
  }

}
