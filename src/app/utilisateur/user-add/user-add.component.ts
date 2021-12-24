import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzFormTooltipIcon } from 'ng-zorro-antd/form';
import { UtilisateurService } from "../utilisateur.service";
import { userAddForm} from "./user-add.type";
import {LoginForm} from "../../login/login.type";

//ng g c utilisateur/user-add
@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css']
})
export class UserAddComponent implements OnInit {

  constructor(private userService: UtilisateurService,private fb: FormBuilder) {
    this.userAddForm = this.fb.group({
      username: [''],
      email: [''],
      password: [''],
      checkPassword: [''],
      role: ['']
    })
  }

  userAddForm!: FormGroup;

  submitForm(): void {
    for (const i in this.userAddForm.controls) {
      if (this.userAddForm.controls.hasOwnProperty(i)) {
        this.userAddForm.controls[i].markAsDirty();
        this.userAddForm.controls[i].updateValueAndValidity();
      }
    }
  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.userAddForm.controls.checkPassword.updateValueAndValidity());
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.userAddForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  resetForm(e:MouseEvent):void {
    e.preventDefault();
    this.userAddForm.reset();
    for (const i in this.userAddForm.controls) {
      if (this.userAddForm.controls.hasOwnProperty(i)) {
        this.userAddForm.controls[i].markAsDirty();
        this.userAddForm.controls[i].updateValueAndValidity();
      }
    }
  }

  addU():void{
    const userAddForm= this.userAddForm;
    const {username, email, password, role} = userAddForm.value;

    const addForm: userAddForm = {
      username,
      email,
      password,
      role
    }
    //console.log(addForm)
    // @ts-ignore
    this.userService.addUser(addForm).subscribe((res:any)=>
    {
      console.log('Add user ',res);
    })
  }

  ngOnInit(): void {
    this.userAddForm = this.fb.group({
      username: [null, [Validators.required]],
      email: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
      role: [null, [Validators.required]],
    });
  }
}
