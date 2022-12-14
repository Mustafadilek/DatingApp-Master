import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Toast, ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Input() usersFromHomeComponent: any;
  @Output() cancelRegister = new EventEmitter();
    model: any = {};
    registerForm: FormGroup;
    maxDate: Date; 
    validaitonErrors: string[];

  constructor(private accountService: AccountService,private toastr: ToastrService,
    private fb: FormBuilder, private router:Router) { }

  ngOnInit(): void {
     this.intitializeForm();
     this.maxDate= new Date();
     this.maxDate.setFullYear(this.maxDate.getFullYear()-18);
  }

   intitializeForm(){
    this.registerForm= this.fb.group({
      gender: ['male',],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateofBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['',[Validators.required, 
        Validators.minLength(4),Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]]
    })
      // this.registerForm.controls.password.valueChanges.subscribe(()=>{
      //     this.registerForm.controls.confirmPassword.updateValueAndValidity();
      // })
   }
    
   matchValues(matchTo: string): ValidatorFn{
        return (control: AbstractControl)=>{
           return control?.value === control?.parent?.controls[matchTo].value 
           ? null: {isMatching: true}
        }
   }
  register() {
    
    this.accountService.register(this.model).subscribe(response => {
      // console.log(response);
      this.router.navigateByUrl('/members');
      this.toastr.error(response.Message);
      //this.cancel();
    }, error => {
      this.validaitonErrors=error;
    })
  }

  cancel(){
    this.cancelRegister.emit(false);
  }
}
