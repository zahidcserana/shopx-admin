import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { ApiResponse, Shop, SUBSCRIPTION_OPTIONS } from '../../models/shop.model';
import { ShopFormComponent } from '../shop-form/shop-form.component';
import { ShopService } from '../../services/shop.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SubscriptionDialogComponent } from '../../components/subscription-dialog/subscription-dialog.component';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-shop-list',
  templateUrl: './shop-list.component.html',
  styleUrl: './shop-list.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatInputModule,
    RouterModule,
    MatChipsModule
  ]
})
export class ShopListComponent {

  /** Table */
  displayedColumns: string[] = [
    'actions',
    'branch_name',
    'pharmacy_shop_name',
    'branch_city',
    'branch_area',
    'subscription_period',
    'branch_full_address',
    'branch_mobile',
    'branch_alt_mobile',
    'branch_contact_person_name',
    'branch_contact_person_mobile',
    'branch_contact_person_alt_mobile',
    'branch_model_pharmacy_status',
    'subscription_count'
  ];

  dataSource = new MatTableDataSource<Shop>([]);

  /** Pagination + sorting */
  total = 0;
  pageSize = 10;
  isExpired = false;
  isExpiredSoon = false;

  /** Search */
  search = '';
  search$ = new Subject<string>();

  /** ViewChild */
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private service: ShopService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  /* ----------------------------------------
   * Lifecycle
   * ------------------------------------- */

  ngOnInit(): void {
    // 🔍 Debounced search
    this.search$
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(value => {
        this.search = value;
        if (this.paginator) {
          this.paginator.pageIndex = 0;
        }
        this.load();
      });
  }

  ngAfterViewInit(): void {
    // 🔃 Pagination
    this.paginator.page.subscribe(() => this.load());

    // 🔃 Sorting
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
      this.load();
    });

    // 🔥 Initial load AFTER view is ready
    Promise.resolve().then(() => this.load());
  }

  toggleExpiredFilter(): void {
    this.isExpired = !this.isExpired;
    if (this.isExpired) this.isExpiredSoon = false;
    this.resetAndLoad();
  }

  toggleExpiredSoonFilter(): void {
    this.isExpiredSoon = !this.isExpiredSoon;
    if (this.isExpiredSoon) this.isExpired = false;
    this.resetAndLoad();
  }

  private resetAndLoad(): void {
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.load();
  }

  public clearSearch(input: HTMLInputElement) {
    input.value = '';
    this.search$.next('');
  }

  /* ----------------------------------------
   * Data loading (SERVER-SIDE)
   * ------------------------------------- */

  load(): void {
    // 🛡️ Hard guard – prevents undefined errors
    if (!this.paginator || !this.sort) {
      return;
    }

    this.service.getAll({
      page: this.paginator.pageIndex + 1,
      perPage: this.paginator.pageSize,
      search: this.search,
      sortBy: this.sort.active || 'id',
      sortDir: this.sort.direction || 'desc',
      expired: this.isExpired,
      expiredSoon: this.isExpiredSoon,
    }).subscribe({
      next: res => {
        this.dataSource.data = res.data;
        this.total = res.total;
      },
      error: err => {
        console.error(err);
        this.snackBar.open('Failed to load shops', 'Close', { duration: 3000 });
      }
    });
  }

  isRowExpired(row: any): boolean {
    const expiry = this.getExpiryDate(row);
    return expiry.getTime() < new Date().getTime();
  }

  /* ----------------------------------------
   * Search
   * ------------------------------------- */

  applySearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.search$.next(value);
  }

  /* ----------------------------------------
   * CRUD actions
   * ------------------------------------- */

  add(): void {
    const dialogRef = this.dialog.open(ShopFormComponent, {
      width: '700px',
      maxHeight: '90vh',
      autoFocus: false,
      data: null
    });

    dialogRef.afterClosed().subscribe(success => {
      if (success) {
        this.load();
      }
    });
  }

  edit(shop: Shop): void {
    const dialogRef = this.dialog.open(ShopFormComponent, {
      width: '700px',
      maxHeight: '90vh',
      autoFocus: false,
      data: shop
    });

    dialogRef.afterClosed().subscribe(success => {
      if (success) {
        this.load();
      }
    });
  }

  delete(shop: Shop): void {
    if (!confirm(`Are you sure you want to delete "${shop.branch_name}"?`)) {
      return;
    }

    this.service.delete(shop.id!).subscribe({
      next: (res => {
        this.snackBar.open(res.message, 'Close', { duration: 3000 })
        this.load()
      }),
      error: err => {
        console.error(err);
        alert('Failed to delete shop');
      }
    });
  }

  getExpiryDate(row: any): Date {
    const createdAt = new Date(row.created_at);
    const totalDays = Number(row.subscription_period);

    // Create a new date object and add the days
    const expiry = new Date(createdAt);
    expiry.setDate(expiry.getDate() + totalDays);
    return expiry;
  }

  updateSubscription(shop: any) {
    const dialogRef = this.dialog.open(SubscriptionDialogComponent, {
      data: {
        current: shop.subscription_period,
        options: SUBSCRIPTION_OPTIONS
      },
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(addedDays => {
      if (addedDays) {
        // 1. Send ONLY the increment to the backend
        this.service.updateSubscription(shop.id, addedDays).subscribe({
          next: (response: any) => {
            // 2. Use the refreshed data from the server to update the UI
            // This ensures the local 'subscription_period' matches the DB exactly
            shop.subscription_period = response.data.subscription_period;

            this.snackBar.open(`Added ${addedDays} days successfully`, 'Close', { duration: 2000 });
          },
          error: () => this.snackBar.open('Failed to update subscription', 'Close')
        });
      }
    });
  }


}
