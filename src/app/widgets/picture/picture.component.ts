import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ImageUploadMeta } from 'src/models/image-upload-meta';
import { ImageUploadComponent } from '../image-upload/image-upload.component';

@Component({
  selector: 'app-picture',
  templateUrl: './picture.component.html',
  styleUrls: ['./picture.component.scss']
})
export class PictureComponent implements OnInit {
  @Input() meta: ImageUploadMeta | null = null;
  @Input() pictureUrl: string = ''
  @Output() url = new EventEmitter<string>();

  private _dialogRef: Subscription | null = null;

  constructor(
    private _dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  onUpdateImage() {
    this._dialogRef?.unsubscribe();
    this._dialogRef = this._dialog.open<ImageUploadComponent, ImageUploadMeta, string>(ImageUploadComponent,{data:this.meta}).afterClosed().subscribe((url) => {
      if (url) {
        this.pictureUrl = url;
        this.url.emit(url);
      }
    });
  }

}
