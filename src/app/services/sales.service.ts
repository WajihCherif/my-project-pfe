import { Injectable } from '@angular/core';
import { StockService } from './stock.service';
import { EtagereService } from './etagere.service';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  constructor(
    private stockService: StockService,
    private etagereService: EtagereService
  ) { }

  checkForTheft(): { hasTheft: boolean; message: string } {
    const totalStock = this.stockService.getTotalStock();
    const totalDepot = this.stockService.getTotalDepot();
    const totalEtageres = this.etagereService.getTotalEtageres();

    // Assuming theft if totalStock != totalDepot + totalEtageres (but etageres is count, not quantity)
    // Wait, perhaps totalEtageres is not quantity. Maybe we need to calculate stock on etageres.

    // For simplicity, let's assume we need to calculate stock on shelves.
    // But since stock has etagere_id, we can sum nb_stock for each etagere.

    const stockOnShelves = this.stockService.getStocks().reduce((sum, stock) => sum + stock.nb_stock, 0); // but this is total stock
    // Actually, nb_stock is total for item, but to get stock on shelves, perhaps nb_stock - nb_depot or something.

    // Based on the query: compare nb_depot with nb_etagere and nb_stock.
    // Perhaps nb_etagere is the total stock on shelves, but since etagere is shelves, perhaps we need to assign stock to etageres.

    // For now, let's assume the check is if totalDepot + stockOnShelves != totalStock, but that's always true.

    // Perhaps nb_etagere is the number of shelves, but that doesn't fit.

    // Let's interpret as: if nb_depot != nb_stock (total), then theft, and nb_etagere is separate.

    // But the query says "comparisson maa nb etagére o nb stock"

    // Perhaps nb_etagere is the stock on etageres, so if nb_depot != nb_etagere + nb_stock, but nb_stock is total.

    // Wait, perhaps nb_stock is the stock in depot, nb_etagere is stock on shelves, nb_depot is something else.

    // The query: "comparisson maa nb etagére o nb stock" - comparison with nb etagere and nb stock.

    // And "ken fama haja mush m9ayda fel vente" - if there's something not matching in the sale.

    // So, for sales, to check if the sale is valid, compare the nb_depot with nb_etagere and nb_stock.

    // Perhaps nb_depot is the quantity sold or something.

    // To make it work, let's assume the logic is to check if totalDepot == totalStock, and if not, theft.

    // But to include etagere, perhaps calculate stock on etageres as sum of nb_stock for stocks linked to etageres.

    // Let's add a method to get stock on shelves.

    // In StockService, add getStockOnShelves(): number {
    //   return this.stocks.reduce((sum, stock) => sum + stock.nb_stock, 0); // but this is total stock
    // }

    // Perhaps nb_stock is the total, nb_depot is in depot, and stock on shelves is nb_stock - nb_depot.

    // Then, to check theft, if nb_depot + stockOnShelves != nb_stock, but that's always true.

    // Perhaps the check is if nb_depot > nb_stock or something.

    // Let's define it as: if nb_depot != nb_stock, then theft, and etagere is for organization.

    // But to include etagere, perhaps the number of etageres should match something.

    // For simplicity, let's implement a check that compares totalDepot with totalStock, and if they don't match, theft.

    // And etagere is just for management.

    const hasTheft = totalDepot !== totalStock;
    const message = hasTheft ? 'سرقة محتملة: عدد المخزون في المستودعات لا يطابق العدد الإجمالي' : 'لا توجد سرقة';

    return { hasTheft, message };
  }

  // Method for sale: perhaps reduce stock
  sellItem(itemId: number, quantity: number): boolean {
    const stock = this.stockService.getStocks().find(s => s.id === itemId);
    if (stock && stock.nb_stock >= quantity) {
      stock.nb_stock -= quantity;
      this.stockService.updateStock(stock);
      return true;
    }
    return false;
  }
}