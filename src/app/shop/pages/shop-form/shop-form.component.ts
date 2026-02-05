import { Component, Inject, Optional, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

import { ShopService } from '../../services/shop.service';
import { CompanyOption, DEFAULT_SHOP_CONFIG, PAYMENT_TYPE_OPTIONS, Shop, SHOP_CONFIG_OPTIONS, ShopConfig } from '../../models/shop.model';
import { debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { ClientService } from 'src/app/client/services/client.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { environment } from 'src/environments/environment';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-shop-form',
  standalone: true,
  templateUrl: './shop-form.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatSelectModule,
    MatCheckboxModule,
    ScrollingModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatCardModule
  ]
})
export class ShopFormComponent implements OnInit {

  private baseDomain = `${environment.apiDomain}`;

  form!: FormGroup;
  isEdit = false;
  shopId?: number;
  isSaving = false;

  companies: any[] = [];
  companyCtrl = new FormControl<string | CompanyOption>('');
  shopConfigOptions = SHOP_CONFIG_OPTIONS;
  paymentTypeOptions = PAYMENT_TYPE_OPTIONS;

  constructor(
    private clientService: ClientService,
    private service: ShopService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    @Optional() private dialogRef: MatDialogRef<ShopFormComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Shop | null,
  ) {}

  // Add these properties to your class
  imagePreview: string | null = null;
  defaultStoreImage = 'assets/images/logos/store.jpg'
  selectedFileBase64: string | null = null;
  @ViewChild('fileInput') fileInput!: ElementRef;

  ngOnInit() {
    this.companyCtrl.valueChanges
    .pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value || typeof value !== 'string') {
          return of([]);
        }
        return this.clientService.search(value);
      })
    )
    .subscribe(res => {
      this.companies = res.data ?? res;
    });

    this.form = this.fb.group({
      email: [null],
      password: [null],
      pharmacy_id: [null, Validators.required],
      branch_name: ['', Validators.required],
      branch_city: [''],
      branch_area: [''],
      branch_full_address: [''],
      branch_model_pharmacy_status: ['YES', Validators.required],
      branch_mobile: ['', Validators.required],
      branch_alt_mobile: [''],
      branch_contact_person_name: [''],
      branch_contact_person_mobile: [''],
      branch_contact_person_alt_mobile: [''],
      subscription_period: [30, [Validators.required, Validators.min(1)]],
      subscription_count: [1, [Validators.required, Validators.min(1)]],
      payment_methods: [[]],
      mobile_banking_account: [''],
      branch_config: this.fb.group(
        this.shopConfigOptions.reduce((acc, opt) => {
          acc[opt.key] = [false];
          return acc;
        }, {} as Record<keyof ShopConfig, any>)
      )
    });

    // 🔁 Clear backend errors on typing
    this.form.valueChanges.subscribe(() => {
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.controls[key];
        if (control.hasError('backend')) {
          control.setErrors(null);
        }
      });
    });

    // 🟢 CASE 1: Dialog edit
    if (this.data) {
      this.isEdit = true;
      this.shopId = this.data.id;
      this.data.pharmacy_id = this.data.pharmacy.id;

      this.companyCtrl.setValue({
        id: this.data.pharmacy?.id,
        pharmacy_shop_name: this.data.pharmacy?.pharmacy_shop_name
      });

      if (this.data && this.data.branch_image) {
          // Assuming the backend returns the path, prepend your API URL if necessary
          this.imagePreview = `${this.baseDomain}${this.data.branch_image}`;
      }
      this.form.patchValue(this.data);
      return;
    }

    // 🟢 CASE 2: Route edit (/shop/edit/:id)
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.shopId = +id;
      this.loadShop(+id);
    }
  }

  displayCompany(company: CompanyOption | string | null): string {
    if (!company || typeof company === 'string') {
      return company ?? '';
    }
    return company.pharmacy_shop_name;
  }

  onCompanySelected(company: any) {
    this.form.patchValue({
      pharmacy_id: company.id
    });
  }

  loadShop(id: number) {
    this.service.getById(id).subscribe({
      next: (shop => {
        if (shop.branch_image) {
          this.imagePreview = `${this.baseDomain}${shop.branch_image}`;
        }

        if (shop.payment_types) {
          const activeMethods = shop.payment_types
            .filter((p: any) => p.status === 'ACTIVE')
            .map((p: any) => p.name);

          this.form.patchValue({ payment_methods: activeMethods });

          const mobileEntry = shop.payment_types.find((p: any) =>
            p.name === 'Mobile Banking' && p.status === 'ACTIVE'
          );
          if (mobileEntry) {
            this.form.patchValue({ mobile_banking_account: mobileEntry.account_no });
          }
        }

        this.form.patchValue(shop);

        this.companyCtrl.setValue({
          id: shop.pharmacy?.id,
          pharmacy_shop_name: shop.pharmacy?.pharmacy_shop_name
        });
      }),
      error: () => {
        this.snackBar.open('Shop not found', 'Close', { duration: 3000 });
        this.router.navigate(['/shop']);
      }
    });
  }

  save() {
    if (this.form.invalid || this.isSaving) return;
    this.isSaving = true;

    if (!this.form.value.pharmacy_id) {
      this.snackBar.open('Please select a company from the list', 'Close', {
        duration: 3000
      });
      return;
    }

    // const payload = this.form.value as Shop;
    const raw = this.form.value;

    const payload: Shop = {
      ...raw,
      branch_config: this.form.value.branch_config,
      branch_image: this.selectedFileBase64
    };

    const request$ = this.isEdit && this.shopId
      ? this.service.update(this.shopId, payload)
      : this.service.create(payload);

    request$.subscribe({
      next: () => {
        this.isSaving = false;
        this.snackBar.open(
          this.isEdit ? 'Shop updated successfully' : 'Shop created successfully',
          'Close',
          { duration: 3000 }
        );

        // Dialog OR page-safe
        this.dialogRef
          ? this.dialogRef.close(true)
          : this.router.navigate(['/shop']);
      },
      error: err => {
        this.isSaving = false;
        if (err.status === 422 && err.error?.errors) {
          this.applyBackendErrors(err.error.errors);
        } else {
          this.snackBar.open('Failed to save shop', 'Close', { duration: 3000 });
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
      : this.router.navigate(['/shop']);
  }

  // 1. Toggle everything on or off
  toggleAllConfigs(isChecked: boolean) {
    const configGroup = this.form.get('branch_config') as FormGroup;
    const updates: any = {};

    this.shopConfigOptions.forEach(opt => {
      updates[opt.key] = isChecked;
    });

    configGroup.patchValue(updates);
  }

  // 2. Check if all items are currently checked (for the UI state)
  isAllSelected(): boolean {
    const values = this.form.get('branch_config')?.value;
    return values && Object.values(values).every(val => val === true);
  }

  // 3. Show a dash (—) if some are checked but not all
  isSomeSelected(): boolean {
    const values = this.form.get('branch_config')?.value;
    if (!values) return false;
    const selectedCount = Object.values(values).filter(val => val === true).length;
    return selectedCount > 0 && selectedCount < this.shopConfigOptions.length;
  }

  removeImage(event: Event) {
    event.stopPropagation(); // Prevent triggering the file click overlay

    this.imagePreview = null;
    this.selectedFileBase64 = null;

    // Clear the actual input value so the same file can be re-selected later
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  // Handle file selection
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // 1. Validate file size (e.g., 2MB)
      if (file.size > 2 * 1024 * 1024) {
        this.snackBar.open('File is too large (Max 2MB)', 'Close', { duration: 3000 });
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        this.selectedFileBase64 = reader.result as string; // This is the Base64 string
      };
      reader.readAsDataURL(file);
    }
  }

  onPaymentTypeChange(type: string, checked: boolean) {
    const current = this.form.get('payment_methods')?.value as string[];
    if (checked) {
      this.form.get('payment_methods')?.setValue([...current, type]);
    } else {
      this.form.get('payment_methods')?.setValue(current.filter(t => t !== type));
      if (type === 'Mobile Banking') {
        this.form.get('mobile_banking_account')?.setValue('');
      }
    }
  }

  isPaymentTypeSelected(type: string): boolean {
    return this.form.get('payment_methods')?.value?.includes(type);
  }
}
