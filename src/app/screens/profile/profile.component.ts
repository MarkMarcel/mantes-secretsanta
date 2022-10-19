import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { UserService } from 'src/app/user/user.service';
import { Child } from 'src/models/child';
import { User } from 'src/models/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements AfterViewInit {
  hasAnsweredHasChildren = false;
  hasChildren = false;
  isLoading = true;
  step = 1;
  children: Child[] = [];
  myChildren: Child[] = [];
  detailsForm = new FormGroup({
    name: new FormControl('', Validators.required),
    isMarried: new FormControl("", Validators.required),
    children: new FormControl([])
  });

  constructor(
    private authService: AuthenticationService,
    private router:Router, 
    private userService: UserService,
    ) { }

  ngAfterViewInit(): void {
    this.setChildren()
  }

  nextQuestion() {
    this.step += 1;
  }

  setHasChildren(hasChildren: boolean) {
    this.hasAnsweredHasChildren = true
    this.hasChildren = hasChildren;
    if (hasChildren) {
      this.observeChildren()
      this.step++;
    } else {
      this.step += 2;
    }
  }

  async updateUserDetails() {
    /* if (this.hasChildren)
      this.detailsForm.controls.children.addValidators(Validators.minLength(1));
    else
      this.detailsForm.controls.children.addValidators(Validators.minLength(1));
    this.detailsForm.controls.children.updateValueAndValidity() */
    this.isLoading = true;
    const isUpdateSuccessful = await this.userService.updateUserDetails(this.createUpdatedUser());
    if(isUpdateSuccessful) this.router.navigate([''])
  }

  private createUpdatedUser(): User {
    const childrenIds = this.hasChildren ? this.detailsForm.controls.children.value : [];
    const isMarried = this.detailsForm.controls.isMarried.value;
    return new User(
      this.authService.auth.currentUser!!.uid,
      childrenIds as string[],
      (isMarried == "true"),
      this.detailsForm.controls.name.value!!,
    );
  }

  private observeChildren() {
    this.detailsForm.controls.children.valueChanges.subscribe((t) => {
      this.myChildren = this.children.filter((child) => (t as string[]).includes(child.id));
    });
  }

  private async setChildren() {
    this.children = await this.userService.getAllChildren();
    this.isLoading = false;
  }
}
