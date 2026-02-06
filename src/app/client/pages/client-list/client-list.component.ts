// src/app/client/pages/client-list/client-list.component.ts

import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

import { ClientFormComponent } from '../client-form/client-form.component';
import { Client } from '../../models/client.model';
import { RouterModule } from '@angular/router';
import { ClientService } from 'src/app/api/services/client.service';

@Component({
  selector: 'app-client-list',
  standalone: true,
  templateUrl: './client-list.component.html',
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
    RouterModule
  ]
})
export class ClientListComponent implements OnInit, AfterViewInit {

  /** Table */
  displayedColumns: string[] = [
    'pharmacy_shop_code',
    'pharmacy_shop_name',
    'pharmacy_shop_owner_name',
    'actions'
  ];
  dataSource = new MatTableDataSource<Client>([]);

  /** Pagination + sorting */
  total: any = 0;
  pageSize = 10;

  /** Search */
  search = '';
  private search$ = new Subject<string>();

  /** ViewChild */
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private service: ClientService,
    private dialog: MatDialog
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
      sortDir: this.sort.direction || 'desc'
    }).subscribe({
      next: res => {
        this.dataSource.data = res.data;
        this.total = res.total;
      },
      error: err => {
        console.error(err);
        alert('Failed to load clients');
      }
    });
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
    const dialogRef = this.dialog.open(ClientFormComponent, {
      width: '500px',
      data: null
    });

    dialogRef.afterClosed().subscribe(success => {
      if (success) {
        this.load();
      }
    });
  }

  edit(client: Client): void {
    const dialogRef = this.dialog.open(ClientFormComponent, {
      width: '500px',
      data: client
    });

    dialogRef.afterClosed().subscribe(success => {
      if (success) {
        this.load();
      }
    });
  }

  delete(client: Client): void {
    if (!confirm(`Are you sure you want to delete "${client.pharmacy_shop_name}"?`)) {
      return;
    }

    this.service.delete(client.id!).subscribe({
      next: () => this.load(),
      error: err => {
        console.error(err);
        alert('Failed to delete client');
      }
    });
  }
}
