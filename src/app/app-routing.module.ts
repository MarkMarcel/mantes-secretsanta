import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './screens/home/home.component';
import { ProfileComponent } from './screens/profile/profile.component';
import { SecretSantaExchangeComponent } from './screens/secret-santa-exchange/secret-santa-exchange.component';
import { SignInComponent } from './screens/sign-in/sign-in.component';
import { AngularFireAuthGuard, hasCustomClaim, redirectUnauthorizedTo, } from '@angular/fire/compat/auth-guard';


const adminOnly = () => hasCustomClaim('admin');
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['auth']);

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
  { path: 'auth', component: SignInComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
  { path: 'secret-santa-exchange', component: SecretSantaExchangeComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: adminOnly } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
