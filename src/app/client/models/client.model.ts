export interface Client {
  id?: number;
  pharmacy_shop_code: string;
  pharmacy_shop_name: string;
  pharmacy_shop_owner_name?: string;
  pharmacy_shop_licence_no?: string;
  pharmacy_shop_license_exp_date?: string; // optional
  pharmacy_shop_dgda_verification_status?: 'ACTIVE' | 'INACTIVE';
}

