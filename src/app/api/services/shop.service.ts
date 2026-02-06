import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { API_ENDPOINTS } from "../endpoints";
import { ApiResponse } from "../config";
import { Shop } from "src/app/shop/models/shop.model";

@Injectable({ providedIn: 'root' })
export class ShopService {
  private base = API_ENDPOINTS.SHOPS

  constructor(private api: ApiService) {}

  getAll(params: {
    page: number;
    perPage: number;
    search?: string;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
    expired: boolean;
    expiredSoon: boolean;
  }) {
    return this.api.get<ApiResponse<Shop[]>>(this.base, {
      page: params.page,
      per_page: params.perPage,
      search: params.search || '',
      sort_by: params.sortBy || 'id',
      sort_dir: params.sortDir || 'desc',
      expired: params.expired,
      expired_soon: params.expiredSoon
    });
  }

  getById(id: number) {
    return this.api.get<Shop>(`${this.base}/${id}`);
  }

  create(data: Shop) {
    return this.api.post(this.base, data);
  }

  update(id: number, data: Shop) {
    return this.api.put(`${this.base}/${id}`, data);
  }

  updateSubscription(id: number, addedDays: number) {
    const payload = { added_days: addedDays };
    return this.api.put(`${this.base}/${id}/subscription`, payload);
  }

  delete(id: number) {
    return this.api.delete<any>(`${this.base}/${id}`);
  }
}
