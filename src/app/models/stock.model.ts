export interface Stock {
  id?: number;
  item_name: string;
  nb_stock: number;
  nb_depot: number;
  etagere_id?: number; // to link to etagere if needed
}