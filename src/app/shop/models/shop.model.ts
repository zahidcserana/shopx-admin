import { Client } from "src/app/client/models/client.model";

export interface Shop {
  id?: number;
  pharmacy_id?: number;
  pharmacy: Client;

  branch_name: string;
  branch_city?: string;
  branch_area?: string;
  branch_full_address?: string;

  branch_mobile?: string;
  branch_alt_mobile?: string;

  branch_contact_person_name?: string;
  branch_contact_person_mobile?: string;

  branch_model_pharmacy_status: 'YES' | 'NO';

  subscription_period?: number;
  subscription_count?: number;
  branch_config: ShopConfig;
  branch_image?: string;
  payment_types?: PaymentType[];
}

export interface PaymentType {
  name: string;
  account_no: string;
  status: string;
}

export interface CompanyOption {
  id?: number;
  pharmacy_shop_name: string;
}

export interface ShopConfig {
  salesman_show: boolean;
  profit_show: boolean;
  tp_show: boolean;
  free_quantity_show: boolean;
  en_batch: boolean;
  en_serial_no: boolean;
  en_tp: boolean;
  en_emi: boolean;
}

// shop-config.options.ts
export const SHOP_CONFIG_OPTIONS: {
  key: keyof ShopConfig;
  label: string;
}[] = [
  { key: 'salesman_show', label: 'Show Salesman' },
  { key: 'profit_show', label: 'Show Profit' },
  { key: 'tp_show', label: 'Show TP' },
  { key: 'free_quantity_show', label: 'Show Free Quantity' },
  { key: 'en_batch', label: 'Enable Batch' },
  { key: 'en_serial_no', label: 'Enable Serial No' },
  { key: 'en_tp', label: 'Enable TP' },
  { key: 'en_emi', label: 'Enable EMI' }
];


export const DEFAULT_SHOP_CONFIG: ShopConfig = {
  salesman_show: false,
  profit_show: true,
  tp_show: true,
  free_quantity_show: true,
  en_batch: true,
  en_serial_no: false,
  en_tp: false,
  en_emi: true
};


export interface ApiResponse {
  status: boolean;
  message: string;
}

export const PAYMENT_TYPE_OPTIONS = ['Cash', 'Mobile Banking', 'Card'];

export const SUBSCRIPTION_OPTIONS = [
  { label: 'Add 1 Month', value: 30 },
  { label: 'Add 3 Months', value: 90 },
  { label: 'Add 6 Months', value: 180 },
  { label: 'Add 1 Year', value: 365 },
];
