import { Injectable } from '@angular/core';
import { Stock } from '../models/stock.model';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private stocks: Stock[] = [
    { id: 1, item_name: 'Item 1', nb_stock: 100, nb_depot: 50, etagere_id: 1 },
    { id: 2, item_name: 'Item 2', nb_stock: 200, nb_depot: 150, etagere_id: 2 }
  ];

  constructor() { }

  getStocks(): Stock[] {
    return this.stocks;
  }

  addStock(stock: Stock): void {
    stock.id = this.stocks.length + 1;
    this.stocks.push(stock);
  }

  updateStock(stock: Stock): void {
    const index = this.stocks.findIndex(s => s.id === stock.id);
    if (index !== -1) {
      this.stocks[index] = stock;
    }
  }

  deleteStock(id: number): void {
    this.stocks = this.stocks.filter(s => s.id !== id);
  }

  getTotalStock(): number {
    return this.stocks.reduce((sum, stock) => sum + stock.nb_stock, 0);
  }

  getTotalDepot(): number {
    return this.stocks.reduce((sum, stock) => sum + stock.nb_depot, 0);
  }
}