import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-poll-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDialogModule,
    MatFormFieldModule,
  ],
  templateUrl: './create-poll-modal.component.html',
  styleUrls: ['./create-poll-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreatePollModalComponent implements OnInit {
  creater_id = localStorage.getItem('user_id')
  pollData = {
    question: '',
    options: ['', '', '', ''], // Initialize with four empty options
    createrId:this.creater_id
  };

  constructor(
    public dialogRef: MatDialogRef<CreatePollModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  onCancel(): void {
    this.dialogRef.close();
  }

  // Form validation method to check if all fields are filled
  isFormValid(): boolean {
    return (
      this.pollData.question.trim() !== '' &&
      this.pollData.options.every(option => option.trim() !== '')
    );
  }
}
