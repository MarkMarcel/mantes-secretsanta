import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './screens/home/home.component';
import { ProfileComponent } from './screens/profile/profile.component';
import { SecretSantaExchangeComponent } from './screens/secret-santa-exchange/secret-santa-exchange.component';
import { SignInComponent } from './screens/sign-in/sign-in.component';
import { AuthGuard, hasCustomClaim, redirectUnauthorizedTo, } from '@angular/fire/auth-guard';
import { CreateSecretSantaExchangeComponent } from './screens/create-secret-santa-exchange/create-secret-santa-exchange.component';


const adminOnly = () => hasCustomClaim('admin');
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['auth']);

export const RoutePaths = {
  'home':'',
  'auth':'auth',
  'profile':'profile',
  'secretSantaExchange':'secret-santa-exchange',
}

const routes: Routes = [ 
  { path: RoutePaths.home, component: CreateSecretSantaExchangeComponent, canActivate: [AuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
  { path: RoutePaths.auth, component: SignInComponent },
  { path: RoutePaths.profile, component: ProfileComponent, canActivate: [AuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
  { path: RoutePaths.secretSantaExchange, component: SecretSantaExchangeComponent, canActivate: [AuthGuard], data: { authGuardPipe: adminOnly } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
