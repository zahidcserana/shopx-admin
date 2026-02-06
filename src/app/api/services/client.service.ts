import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { API_ENDPOINTS } from "../endpoints";
import { Client } from "src/app/client/models/client.model";
import { ApiResponse } from "../config";

@Injectable({ providedIn: 'root' })
export class ClientService {
  private base = API_ENDPOINTS.CLIENTS

  constructor(private api: ApiService) {}

  getAll(params: {
    page: number;
    perPage: number;
    search?: string;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
  }) {
    return this.api.get<ApiResponse<Client[]>>(this.base, {
      page: params.page,
      per_page: params.perPage,
      search: params.search || '',
      sort_by: params.sortBy || 'id',
      sort_dir: params.sortDir || 'desc'
    });
  }

  getById(id: number) {
    return this.api.get<Client>(`${this.base}/${id}`);
  }

  search(search: string) {
    return this.api.get<any>(`${this.base}`, {
      search: search || ''
    });
  }

  create(data: any) {
    return this.api.post(this.base, data);
  }

  update(id: number, data: Client) {
    return this.api.put(`${this.base}/${id}`, data);
  }

  delete(id: number) {
    return this.api.delete(`${this.base}/${id}`);
  }
}
