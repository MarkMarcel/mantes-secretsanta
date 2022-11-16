import { AfterViewInit, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/app/user/user.service';
import { Child } from 'src/models/child';
import { User } from 'src/models/user';

interface CheckResults{
  adults:User[]
  child:Child|null
  person:User
}

@Component({
  selector: 'app-check-results',
  templateUrl: './check-results.component.html',
  styleUrls: ['./check-results.component.scss']
})
export class CheckResultsComponent implements AfterViewInit {
  //test
  children: Child[] = [];
  familyMembers: User[] = [];
  checkResults:CheckResults[] = [];
  isLoading = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data:{adults:string[],child:string|null,person:string}[],
    private _dialog: MatDialogRef<CheckResultsComponent>,
    private _userService: UserService,
    ) { }

  ngAfterViewInit(): void {
    this.setup();
  }

  close(){
    this._dialog.close();
  }  

  private async setup(){
    this.familyMembers = await this._userService.getAllUsers();
    this.children = await this._userService.getAllChildren();
    this.checkResults = this._data.map(result => {
      return {
        adults: result.adults.map(ad => this.familyMembers.find(f => f.id == ad)!!),
        child: this.children.find(c => c.id == result.child)??null,
        person: this.familyMembers.find(c => c.id == result.person)!!,
      }
    })
    this.isLoading = false;
  }

}
