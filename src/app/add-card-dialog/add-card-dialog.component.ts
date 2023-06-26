import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Card } from '../card';
import { CardService } from '../card.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-card-dialog',
  templateUrl: './add-card-dialog.component.html',
  styleUrls: ['./add-card-dialog.component.css']
})

export class AddCardDialogComponent {
  
  FormAddCard!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddCardDialogComponent>,
    private cardService: CardService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.FormAddCard = this.formBuilder.group({
      name: ['', [Validators.required]],
      attribute: ['', [Validators.required]],
      monsterType: ['', [Validators.required]],
      cardType: ['', [Validators.required]],
      levelRank: [0, [Validators.required, Validators.pattern(/^\d+$/), Validators.min(0), Validators.max(12)]],
      pendulum: [0, [Validators.required, Validators.pattern(/^\d+$/), Validators.min(0), Validators.max(12)]],
      link: [0, [Validators.required, Validators.pattern(/^\d+$/), Validators.min(0), Validators.max(12)]],
      atk: [0, [Validators.required, Validators.pattern(/^\d+$/) , Validators.min(0) ]],
      def: [0, [Validators.required, Validators.pattern(/^\d+$/), Validators.min(0)]],
      icon: ['', [Validators.required]],
      effectDescription: ['EFFETTO']
    })
  }


  onSubmitAddCard() {
    const card: Card = this.FormAddCard?.value;
    this.cardService.addCard(card).subscribe(
      (respose: Card) => {
        alert('Card added successfully.');
        window.location.reload();
      },
      (error: HttpErrorResponse) => {
        if(error.status === 409){
          alert('this card already exists');
        }
        else{
          alert('An error occurred: ' + error.status);
        }
      }
  );
    
  }
}
