import { AfterViewInit, Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ExchangeService } from 'src/app/exchange/exchange.service';
import { UserService } from 'src/app/user/user.service';
import { Child } from 'src/models/child';
import { Exchange } from 'src/models/exchange';
import { User } from 'src/models/user';

enum State{
  FORM,REVIEW
}

@Component({
  selector: 'app-create-secret-santa-exchange',
  templateUrl: './create-secret-santa-exchange.component.html',
  styleUrls: ['./create-secret-santa-exchange.component.scss']
})
export class CreateSecretSantaExchangeComponent implements AfterViewInit {
  children: Child[] = [];
  familyMembers:User[] = [];
  isLoading = true;
  numGiftsPerChild = 0;
  participatingChildren: Child[] = [];
  participatingFamilyMembers:User[] = [];
  State = State;
  state = State.FORM;
  step = 1;
  year = (new Date()).getUTCFullYear()
  manteSecretSantaExchangeForm = new FormGroup({
    numberOfGifts: new FormControl<string>('', Validators.required),
    participating: new FormControl<string[]>([], Validators.compose([Validators.required,Validators.minLength(1)])),
    children: new FormControl<string[]>([], Validators.compose([Validators.required,Validators.minLength(1)])),
    membersToBuyForChildren: new FormControl<string[]>([], Validators.compose([Validators.required,Validators.minLength(1)])),
  });

  constructor(private exchangeService:ExchangeService,private userService:UserService) { }

  ngAfterViewInit(): void {
    this.setup();
    this.observeParticipatingChildren();
    this.observeParticipatingMembers();
    this.observeMembersToBuyForChildren();
  }

  back(){
    this.step--;
  }

  async createExchange(){
    this.isLoading = true
    const buyingForChildren = this.manteSecretSantaExchangeForm.controls.membersToBuyForChildren.value!!;
    const numberOfGifts = this.manteSecretSantaExchangeForm.controls.numberOfGifts.value!!;
    const participatingChildren = this.manteSecretSantaExchangeForm.controls.children.value!!;
    const participatingFamilyMembers = this.manteSecretSantaExchangeForm.controls.participating.value!!;
    const exchange = new Exchange('',buyingForChildren,parseInt(numberOfGifts),participatingChildren,participatingFamilyMembers,this.year);
    await this.exchangeService.saveExchangeDetails(exchange);
    this.isLoading = false;
  }

  editForm(){
    this.state = State.FORM;
  }

  isBuyingForChild(id:string):boolean{
    return this.manteSecretSantaExchangeForm.controls.membersToBuyForChildren.value!!.includes(id);
  }

  next(){
    this.step++;
  }

  review(){
    this.state = State.REVIEW;
  }

  private observeParticipatingChildren(){
    this.manteSecretSantaExchangeForm.controls.children.valueChanges.subscribe((c) =>{
      this.participatingChildren = this.children.filter((f) => c?.includes(f.id));
      this.numGiftsPerChild = Math.floor(this.manteSecretSantaExchangeForm.controls.membersToBuyForChildren.value!!.length/c!!.length);
    });
  }

  private observeMembersToBuyForChildren(){
    this.manteSecretSantaExchangeForm.controls.membersToBuyForChildren.valueChanges.subscribe((c) =>{
      this.numGiftsPerChild = Math.floor(c!!.length/this.participatingChildren.length);
    });
  }

  private observeParticipatingMembers(){
    this.manteSecretSantaExchangeForm.controls.participating.valueChanges.subscribe((p) => {
        this.participatingFamilyMembers = this.familyMembers.filter((f) => (p as string[]).includes(f.id));
        const m = this.participatingFamilyMembers.filter((f) => f.isMarried).map((f) => f.id);
        const e = (this.manteSecretSantaExchangeForm.controls.membersToBuyForChildren.value!!).filter((id) => this.participatingFamilyMembers.find((f) => f.id == id));
        this.manteSecretSantaExchangeForm.controls.membersToBuyForChildren.setValue(Array.from(new Set(m.concat(e))));
    });
  }

  private async setup(){
    this.familyMembers = await this.userService.getAllUsers();
    this.children = await this.userService.getAllChildren();
    this.isLoading = false;
  }
}
