import { Component, Inject, Optional, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-client-form',
  standalone: true,
  templateUrl: './client-form.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    MatCardModule
  ]
})
export class ClientFormComponent implements OnInit {

  form!: FormGroup;
  isEdit = false;
  clientId?: number;

  constructor(
    private service: ClientService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,

    // Optional dialog support
    @Optional() private dialogRef: MatDialogRef<ClientFormComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Client | null,
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      pharmacy_shop_code: ['', Validators.required],
      pharmacy_shop_name: ['', Validators.required],
      pharmacy_shop_owner_name: ['', Validators.required],
      pharmacy_shop_licence_no: [''],
    });

    // 🟢 CASE 1: Dialog edit
    if (this.data) {
      this.isEdit = true;
      this.clientId = this.data.id;
      this.form.patchValue(this.data);
      return;
    }

    // 🟢 CASE 2: Route edit (/edit/:id)
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.clientId = +id;
      this.loadClient(+id);
    }
  }

  loadClient(id: number) {
    this.service.getById(id).subscribe({
      next: client => this.form.patchValue(client),
      error: () => {
        this.snackBar.open('Client not found', 'Close', { duration: 3000 });
        this.router.navigate(['/client']);
      }
    });
  }

  save() {
    if (this.form.invalid) return;

    const payload = this.form.value as Client;

    const request$ = this.isEdit && this.clientId
      ? this.service.update(this.clientId, payload)
      : this.service.create(payload);

    request$.subscribe({
      next: () => {
        this.snackBar.open(
          this.isEdit ? 'Client updated successfully' : 'Client created successfully',
          'Close',
          { duration: 3000 }
        );

        // Dialog or page-safe
        this.dialogRef
          ? this.dialogRef.close(true)
          : this.router.navigate(['/client']);
      },
      error: err => {
        if (err.status === 422 && err.error?.errors) {
          this.applyBackendErrors(err.error.errors);
        } else {
          this.snackBar.open('Failed to save client', 'Close', { duration: 3000 });
        }
      }
    });
  }

  applyBackendErrors(errors: any) {
    Object.keys(errors).forEach(field => {
      if (this.form.controls[field]) {
        this.form.controls[field].setErrors({ backend: errors[field][0] });
      }
    });
  }

  get f() {
    return this.form.controls;
  }

  cancel() {
    this.dialogRef
      ? this.dialogRef.close(false)
      : this.router.navigate(['/client']);
  }
}
