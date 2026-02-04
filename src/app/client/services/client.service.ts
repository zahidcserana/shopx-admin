import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Client } from '../models/client.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ClientService {
  private base = `${environment.apiUrl}/admin/clients`;

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<{data: Client[]}>(this.base)
      .pipe(map(res => res.data));
  }

  create(data: Client) {
    return this.http.post(this.base, data);
  }

  update(id: number, data: Client) {
    return this.http.put(`${this.base}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.base}/${id}`);
  }

  getById(id: number) {
    return this.http.get<Client>(`${this.base}/${id}`);
  }

  getAll(params: {
    page: number;
    perPage: number;
    search?: string;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
  }) {
    return this.http.get<any>(`${this.base}`, {
      params: {
        page: params.page,
        per_page: params.perPage,
        search: params.search || '',
        sort_by: params.sortBy || 'id',
        sort_dir: params.sortDir || 'desc'
      }
    });
  }

  search(search: string) {
    return this.http.get<any>(`${this.base}`, {
      params: {
        search: search || ''
      }
    });
  }

}

