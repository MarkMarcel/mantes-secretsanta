import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { ImageService } from 'src/app/image/image.service';
import { ImageUploadMeta } from 'src/models/image-upload-meta';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit {
  imageChangedEvent: any = '';
  isLoading = false;
  isPreviewCrop = false;
  isShowCropper = false;
  croppedImage: any = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: ImageUploadMeta,
    private _dialog: MatDialogRef<ImageUploadComponent>,
    private _imageService: ImageService,
    private _snackbar: MatSnackBar,
  ) { }

  ngOnInit(): void {
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  imageLoaded(image: LoadedImage) {
    this.isPreviewCrop = false;
    this.isShowCropper = true;
  }

  cropperReady() { }

  loadImageFailed() {
    this._snackbar.open('Failed to load image');
  }

  previewEdit() {
    this.isPreviewCrop = !this.isPreviewCrop;
  }

  async uploadImage() {
    this.isLoading = true
    try {
      const url = await this._imageService.saveImage(this._data.id, this.croppedImage, this._data.type);
      this._dialog.close(url);
    } catch (e: any) {
      this._snackbar.open("Failed to upload image");
     }
    finally {
      this.isLoading = false;
    }
  }

}
