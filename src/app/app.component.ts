import { Component, OnInit } from '@angular/core';
import { Card } from './card';
import { CardService } from './card.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LogInDialogComponent } from './log-in-dialog/log-in-dialog.component';
import { AuthService } from './auth/auth.service';
import { AddCardDialogComponent } from './add-card-dialog/add-card-dialog.component';
import { SignInDialogComponent } from './sign-in-dialog/sign-in-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {


  title = 'YuGiCardArchiveApp';
  cards!: Card[];
  PageCount = -1;
  myForm!: FormGroup;

  currentCard: Card = {} as Card;

  isFilterHidden = true;
  isMoreCardsHidden = false;

  constructor( private cardService: CardService,
               private formBuilder: FormBuilder,
               private logInDial: MatDialog,
              private authService: AuthService,
              private addCardDial: MatDialog
  ){}

  hideContainer() {
    this.isFilterHidden = !this.isFilterHidden;
  }
  

  public areCardsInitialized(): boolean {
    return this.cards !== null && this.cards !== undefined;
  }

  ngOnInit(): void {
      this.PageCount = -1;
      this.getTopCards();



      this.myForm = this.formBuilder.group({
        name: [null],
        attributes: [null],
        MonsterTypes: [null],
        types: [null],
        LevelRankFrom: [0, [Validators.pattern(/^\d+$/), Validators.min(0), Validators.max(12)]],
        LevelRankTo: [12, [Validators.pattern(/^\d+$/), Validators.min(0), Validators.max(12)]],
        PendulumFrom: [0, [Validators.pattern(/^\d+$/), Validators.min(0), Validators.max(12)]],
        PendulumTo: [12, [Validators.pattern(/^\d+$/), Validators.min(0), Validators.max(12)]],
        LinkFrom: [0, [Validators.pattern(/^\d+$/), Validators.min(0), Validators.max(12)]],
        LinkTo: [12, [Validators.pattern(/^\d+$/), Validators.min(0), Validators.max(12)]],
        atkFrom: [0, [Validators.pattern(/^\d+$/), Validators.min(0)]],
        atkTo: [null, [Validators.pattern(/^\d+$/), Validators.min(0)]],
        defFrom: [0, [Validators.pattern(/^\d+$/), Validators.min(0)]],
        defTo: [null, [Validators.pattern(/^\d+$/), Validators.min(0)]],
        icon: [null]
      });
  }

  public getCards(): void{
    this.cardService.getAllCards().subscribe(
      (respose: Card[]) => {
        this.cards = respose;
      },
      (error: HttpErrorResponse) => {
        alert("Server is Down");
      }
    );
  }

  public getTopCards(): void{
    this.PageCount++;
    this.cardService.getTopCards(this.PageCount).subscribe(
      (respose: Card[]) => {
        this.areCardsInitialized() ? this.cards = this.cards.concat(respose) : this.cards = respose;
      },
      (error: HttpErrorResponse) => {
        alert("Server is Down");
      }
    );
  }

  getRows(): Card[][] {
    const rows: Card[][] = [];
    const itemsPerRow = 5;
    const rowCount = this.areCardsInitialized()? Math.ceil(this.cards.length / itemsPerRow): 0;
  
    for (let i = 0; i < rowCount; i++) {
      const startIndex = i * itemsPerRow;
      const endIndex = startIndex + itemsPerRow;
      const row = this.cards.slice(startIndex, endIndex);
  
      if (row.length < itemsPerRow) {
        const emptySpacesCount = itemsPerRow - row.length;
        for (let j = 0; j < emptySpacesCount; j++) {
          row.push({} as Card);
        }
      }
  
      rows.push(row);
    }
  
    return rows;
  }
  
  onSubmitFilter() {
    this.PageCount = -1;
    this.isMoreCardsHidden = true;    
    
    this.cardService.getFilteredCards(this.myForm.value.name, this.myForm.value.attributes,
                                      this.myForm.value.MonsterTypes, this.myForm.value.types, 
                                      this.myForm.value.LevelRankFrom, this.myForm.value.LevelRankTo, 
                                      this.myForm.value.PendulumFrom, this.myForm.value.PendulumTo, 
                                      this.myForm.value.LinkFrom, this.myForm.value.LinkTo, 
                                      this.myForm.value.atkFrom, this.myForm.value.atkTo, 
                                      this.myForm.value.defFrom, this.myForm.value.defTo, 
                                      this.myForm.value.icon
      ).subscribe(
        (respose: Card[]) => {
          this.cards = respose;
          
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
    );
  }

  onOpenModal(card: Card,mode: string) {
    this.currentCard = card;
    
  }

  toggleOptions(): void {
    const options = document.getElementById('user-options')!;
    if (options.style.display === 'none') {
      options.style.display = 'block';
    } else {
      options.style.display = 'none';
    }
  }

  imLogged(): boolean {    
    return this.authService.getAccessToken() !== null;
  }
  
  

  logIn() {
    const dialogRef = this.logInDial.open(LogInDialogComponent,{
      data: {
        SignIn: this.SignIn.bind(this)
      }
    });
    document.getElementById('user-options')!.style.display = 'none';
  }

  logOut(){
    this.authService.logOut();
    document.getElementById('user-options')!.style.display = 'none';
  }
  
  openAddCardMenu() {
    const dialogRef = this.addCardDial.open(AddCardDialogComponent);
  }

  DeleteCard() {
    if (confirm(`Are you sure you want to delete '${this.currentCard.name}'?`)) {
      this.cardService.deleteCardByName(this.currentCard.name).subscribe(
        (respose: boolean) => {
          if (respose) {
            alert('Card deleted successfully.');
            
          } else {
            alert('Card not found with the given name or deletion failed.');
          }
          window.location.reload();
        },
        (error: HttpErrorResponse) => {
          console.error('An error occurred: ' + error.message);
        }
      );
    }
  }

  SignIn() {
    const dialogRef = this.logInDial.open(SignInDialogComponent,{
      data: {
        LogIn: this.logIn.bind(this)
      }
    });
    document.getElementById('user-options')!.style.display = 'none';
  }
  


}
