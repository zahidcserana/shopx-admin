import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ApiResponse, Shop } from '../models/shop.model';

@Injectable({ providedIn: 'root' })
export class ShopService {
  private apiUrl = `${environment.apiUrl}/admin/shops`;

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<{data: Shop[]}>(this.apiUrl)
      .pipe(map(res => res.data));
  }

  create(data: Shop) {
    return this.http.post(this.apiUrl, data);
  }

  update(id: number, data: Shop) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${id}`);
  }

  getById(id: number) {
    return this.http.get<Shop>(`${this.apiUrl}/${id}`);
  }

  getAll(params: {
    page: number;
    perPage: number;
    search?: string;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
    expired: boolean;
    expiredSoon: boolean;
  }) {
    return this.http.get<any>(`${this.apiUrl}`, {
      params: {
        page: params.page,
        per_page: params.perPage,
        search: params.search || '',
        sort_by: params.sortBy || 'id',
        sort_dir: params.sortDir || 'desc',
        expired: params.expired,
        expired_soon: params.expiredSoon
      }
    });
  }

  updateSubscription(id: number, addedDays: number) {
    const payload = { added_days: addedDays };
    return this.http.put(`${this.apiUrl}/${id}/subscription`, payload);
  }
}

