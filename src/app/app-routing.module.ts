import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './screens/home/home.component';
import { ProfileComponent } from './screens/profile/profile.component';
import { SignInComponent } from './screens/sign-in/sign-in.component';
import { AuthGuard, redirectUnauthorizedTo, } from '@angular/fire/auth-guard';
import { SetupExchangeComponent } from './screens/setup-exchange/setup-exchange.component';
import { AddItemWantedComponent } from './screens/add-item-wanted/add-item-wanted.component';


const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['auth']);

export const RoutePaths = {
  'home': '',
  'auth': 'auth',
  'addItemWanted': 'add-item-wanted/',
  'editProfile': 'profile/',
  'profile': 'setup-profile',
  'setupExchange': 'setup-exchange',
}

const routes: Routes = [
  { path: RoutePaths.home, component: HomeComponent, canActivate: [AuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin }, title: 'Home' },
  { path: RoutePaths.auth, component: SignInComponent, title: 'Sign In' },
  { path: RoutePaths.addItemWanted + ":exchangeId", component: AddItemWantedComponent, canActivate: [AuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin }, title: 'Add Item Wanted' },
  { path: RoutePaths.editProfile + ":id", component: ProfileComponent, canActivate: [AuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin }, title: 'Edit Profile' },
  { path: RoutePaths.profile, component: ProfileComponent, canActivate: [AuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin }, title: 'Setup Profile' },
  { path: RoutePaths.setupExchange, component: SetupExchangeComponent, canActivate: [AuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin }, title: 'Setup Gifts Exchange' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
