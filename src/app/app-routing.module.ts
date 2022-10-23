import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './screens/home/home.component';
import { ProfileComponent } from './screens/profile/profile.component';
import { SignInComponent } from './screens/sign-in/sign-in.component';
import { AuthGuard, hasCustomClaim, redirectUnauthorizedTo, } from '@angular/fire/auth-guard';
import { SetupExchangeComponent } from './screens/setup-exchange/setup-exchange.component';
import { ImageUploadComponent } from './widgets/image-upload/image-upload.component';


const adminOnly = () => hasCustomClaim('admin');
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['auth']);

export const RoutePaths = {
  'home':'',
  'auth':'auth',
  'profile':'profile',
  'setupExchange':'setup-exchange',
}

const routes: Routes = [
  { path: RoutePaths.home, component: ImageUploadComponent, canActivate: [AuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
  { path: RoutePaths.auth, component: ImageUploadComponent },
  { path: RoutePaths.profile, component: ProfileComponent, canActivate: [AuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
  { path: RoutePaths.setupExchange, component: SetupExchangeComponent, canActivate: [AuthGuard], data: { authGuardPipe: adminOnly } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
