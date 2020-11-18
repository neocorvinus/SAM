import { Component, OnInit } from '@angular/core';
import { FormControl, Validators  } from '@angular/forms';

export interface Account {
  firstName: string;
  lastName: string;
  email: string;
}

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  account: Account;
  emailForm = new FormControl('', [Validators.required, Validators.email]);

  constructor() { }

  ngOnInit() {
    this.account = {firstName: "Jules", lastName: "Furret", email: "furretj@et.esiea.fr"};
    //console.log(this.account.firstName);
  }

  validate() {
    console.log(this.account);
  }

}
