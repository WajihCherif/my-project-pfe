export interface Depot {
  id?: number;
  depot_code: string;
  name: string;
  location?: string;
  address?: string;
  manager_name?: string;
  phone?: string;
  created_at?: string;
}

export interface DepotCreate {
  depot_code: string;
  name: string;
  location?: string;
  address?: string;
  manager_name?: string;
  phone?: string;
}
