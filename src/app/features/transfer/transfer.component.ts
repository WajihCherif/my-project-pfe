import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransferService } from '../../core/services/transfer.service';
import { ProductService } from '../../core/services/product.service';
import { EtagereService } from '../../core/services/etagere.service';
import { Product } from '../../shared/models/product.model';
import { Etagere } from '../../shared/models/etagere.model';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './transfer.component.html'
})
export class TransferComponent implements OnInit {
  transferForm!: FormGroup;
  loading = false;
  toastMessage = '';
  toastType = 'success';
  
  products: Product[] = [];
  etageres: Etagere[] = [];

  constructor(
    private fb: FormBuilder, 
    private transferService: TransferService,
    private productService: ProductService,
    private etagereService: EtagereService
  ) {}

  ngOnInit(): void {
    this.transferForm = this.fb.group({
      product_id: [null, Validators.required],
      from_etagere_id: [null, Validators.required],
      to_etagere_id: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      notes: ['']
    });

    this.productService.getAll().subscribe(data => this.products = data);
    this.etagereService.getAll().subscribe(data => this.etageres = data);
  }

  onSubmit(): void {
    if (this.transferForm.invalid) return;
    this.loading = true;

    this.transferService.transfer(this.transferForm.value).subscribe({
      next: () => {
        this.showToast('Transfer completed successfully!', 'success');
        this.transferForm.reset({ quantity: 1 });
        this.loading = false;
      },
      error: (err) => {
        this.showToast(err.message, 'danger');
        this.loading = false;
      }
    });
  }

  showToast(message: string, type: 'success' | 'danger') {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => this.toastMessage = '', 4000);
  }
}
