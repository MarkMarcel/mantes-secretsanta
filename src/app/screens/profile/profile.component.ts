import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { UserService } from 'src/app/user/user.service';
import { Child } from 'src/models/child';
import { User } from 'src/models/user';

enum State{
  FORM,REVIEW
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements AfterViewInit,OnDestroy {
  hasAnsweredHasChildren = false;
  hasChildren = false;
  isLoading = true;
  isGettingChildren = true;
  isSettingUpReview = false;
  State = State;
  state = State.FORM;
  step = 1;
  children: Child[] = [];
  myChildren: Child[] = [];
  detailsForm = new FormGroup({
    name: new FormControl('', Validators.required),
    isMarried: new FormControl("", Validators.required),
    children: new FormControl<string[]>([])
  });
  
  private _routeSubscription: Subscription|null = null;

  constructor(
    private _authService: AuthenticationService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _snackBar: MatSnackBar,
    private _userService: UserService,
  ) {}

  ngAfterViewInit(): void {
    this.setup()
  }

  ngOnDestroy(): void {
    this._routeSubscription?.unsubscribe();
  }

  editForm(){
    this.hasAnsweredHasChildren = false;
    this.hasChildren = false;
    this.state = State.FORM;
  }

  nextQuestion() {
    this.step += 1;
    if (this.step == 3) this.detailsForm.controls.isMarried.markAsDirty();
  }

  review(){
    if (this.isFormValid()) {
      this.state = State.REVIEW;
    }else{
      this._snackBar.open("Fix errors");
    }
  }

  setHasChildren(hasChildren: boolean) {
    this.hasAnsweredHasChildren = true
    this.hasChildren = hasChildren;
    if (hasChildren) {
      this.step++;
    } else {
      this.step += 2;
    }
  }

  async updateUserDetails() {
    if (this.isFormValid()) {
      this.isLoading = true;
      const isUpdateSuccessful = await this._userService.updateUserDetails(this.createUpdatedUser());
      if (isUpdateSuccessful) this._router.navigate([''])
    }else{
      this.state = State.FORM;
      this._snackBar.open("Fix errors");
    }
  }

  private createUpdatedUser(): User {
    const childrenIds = this.hasChildren ? this.detailsForm.controls.children.value : [];
    const isMarried = this.detailsForm.controls.isMarried.value;
    return new User(
      this._authService.auth.currentUser!!.uid,
      childrenIds as string[],
      (isMarried == "true"),
      this.detailsForm.controls.name.value!!,
    );
  }

  private isFormValid(): boolean {
    let isValid = this.detailsForm.valid;
    if (this.hasChildren && (this.detailsForm.controls.children.value!!.length < 1)) {
      this.detailsForm.controls.children.setErrors({ notMinLength: true });
      isValid = isValid && this.detailsForm.controls.children.valid;
    }
    return isValid;
  }

  private observeChildren() {
    this.detailsForm.controls.children.valueChanges.subscribe((t) => {
      this.myChildren = this.children.filter((child) => (t as string[]).includes(child.id));
    });
  }

  private async setup() {
    this.observeChildren()
    this.children = await this._userService.getAllChildren();
    this.isGettingChildren = false;
    this.isLoading = this.isSettingUpReview;
    this._routeSubscription = this._route.paramMap.subscribe((paramMap:ParamMap) => {
      if(paramMap.get('id')){
        this.isSettingUpReview = true;
        this._userService.getUserDetails(paramMap.get('id') as string)
        this.setupReview();
      }
    });
  }

  private async setupReview(){
    this._userService.user$.subscribe((user) => {
      if(user != null){
        this.hasChildren = (user.childrenIds.length > 0)
        this.detailsForm.controls.name.setValue(user.name);
        this.detailsForm.controls.isMarried.setValue((user.isMarried)? 'true' : 'false');
        this.detailsForm.controls.children.setValue(user.childrenIds)
        this.state = State.REVIEW;
        this.isSettingUpReview = false;
        this.isLoading = this.isGettingChildren;
      }
    });
  }
}
