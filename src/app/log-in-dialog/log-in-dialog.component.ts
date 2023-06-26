import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-log-in-dialog',
  templateUrl: './log-in-dialog.component.html',
  styleUrls: ['./log-in-dialog.component.css']
})
export class LogInDialogComponent implements OnInit {

  FormLogIn!: FormGroup;


  constructor(
              public dialogRef: MatDialogRef<LogInDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private formBuilder: FormBuilder,
              private authService: AuthService
  ) {}

  ngOnInit() {
    this.FormLogIn = this.formBuilder.group({
      email: [null],
      pw: [null]
    })
  }

  async onSubmitLogIn() {
    try {
      const response: string = await this.authService.auth(this.FormLogIn.value.email, this.FormLogIn.value.pw);
      switch (response) {
        case "OK":
          this.dialogRef.close();
          break;
        case "AccessDenied":
          document.getElementById('ErrorEmPw')!.style.display = 'block';
          break;
        case "ServerDown":
          alert("Server is down");
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Authentication error:', error);
    }
  }


  OpenSignIn() {
    this.dialogRef.close();
    this.data.SignIn();
  }

}
