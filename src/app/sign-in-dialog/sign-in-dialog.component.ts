import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-sign-in-dialog',
  templateUrl: './sign-in-dialog.component.html',
  styleUrls: ['./sign-in-dialog.component.css']
})
export class SignInDialogComponent implements OnInit{

  FormSignIn!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<SignInDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.FormSignIn = this.formBuilder.group({
      nickName: [null],
      email: [null, [Validators.required, Validators.email]],
      pw: [null, [Validators.required, Validators.minLength(8)]],
      pwConfirm: [null, [Validators.required, this.passwordMatchValidator.bind(this)]]
    });

    this.FormSignIn.get('pw')?.valueChanges.subscribe(() => {
      this.FormSignIn.get('pwConfirm')?.setValue(null);
    });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null{
    const password = control.parent?.get('pw')?.value;
    const confirmPassword = control.parent?.get('pwConfirm')?.value;
    if (password != confirmPassword) {
      return { passwordMismatch: true };
    }
  
    return null;
  }

  OpenLogIn() {
    this.dialogRef.close();
    this.data.LogIn();
  }
  
  async onSubmitSignIn() {
    const response: string = await this.authService.register(this.FormSignIn.value.nickName,this.FormSignIn.value.email, this.FormSignIn.value.pw);
    alert(response);
  }
}
