import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CardService } from './card.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { AddCardDialogComponent } from './add-card-dialog/add-card-dialog.component';
import { LogInDialogComponent } from './log-in-dialog/log-in-dialog.component';
import { AuthInterceptor } from './auth/AuthInterceptor';
import { SignInDialogComponent } from './sign-in-dialog/sign-in-dialog.component';



@NgModule({
  declarations: [
    AppComponent,
    AddCardDialogComponent,
    LogInDialogComponent,
    SignInDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
  providers: [
    CardService,
    AuthInterceptor,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
