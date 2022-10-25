import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule, MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import {MatToolbarModule} from '@angular/material/toolbar';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ProfileComponent } from './screens/profile/profile.component';
import { HomeComponent } from './screens/home/home.component';
import { SignInComponent } from './screens/sign-in/sign-in.component';
import { ChildComponent } from './widgets/child/child.component';
import { SetupExchangeComponent } from './screens/setup-exchange/setup-exchange.component';
import { ImageUploadComponent } from './widgets/image-upload/image-upload.component';
import { PictureComponent } from './widgets/picture/picture.component';
import { LoadingComponent } from './widgets/loading/loading.component';
import { AdultComponent } from './widgets/adult/adult.component';
import { SantaComponent } from './widgets/santa/santa.component';
import { AddItemWantedComponent } from './screens/add-item-wanted/add-item-wanted.component';
import { MyWantedItemComponent } from './widgets/my-wanted-item/my-wanted-item.component';
import { ItemsWantedComponent } from './widgets/items-wanted/items-wanted.component';
import { ItemWantedComponent } from './widgets/item-wanted/item-wanted.component';

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    HomeComponent,
    SignInComponent,
    ChildComponent,
    SetupExchangeComponent,
    ImageUploadComponent,
    PictureComponent,
    LoadingComponent,
    AdultComponent,
    SantaComponent,
    AddItemWantedComponent,
    MyWantedItemComponent,
    ItemsWantedComponent,
    ItemWantedComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp((environment as any).firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    BrowserAnimationsModule,
    ImageCropperModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSnackBarModule,
    MatToolbarModule,
    NgxIntlTelInputModule,
    ReactiveFormsModule,
  ],
  providers: [
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 3000,verticalPosition:'top'} },
    { provide: MAT_RADIO_DEFAULT_OPTIONS, useValue: { color: 'primary' }, }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
