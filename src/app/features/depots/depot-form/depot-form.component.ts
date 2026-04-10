import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DepotService } from '../../../core/services/depot.service';
import { Depot } from '../../../shared/models/depot.model';

@Component({
  selector: 'app-depot-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './depot-form.component.html'
})
export class DepotFormComponent implements OnInit {
  depotForm!: FormGroup;
  depotId?: number;
  loading = false;
  submitting = false;
  toastMessage = '';
  toastType = 'success';

  constructor(
    private fb: FormBuilder,
    private depotService: DepotService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.depotForm = this.fb.group({
      depot_code: ['', Validators.required],
      name: ['', Validators.required],
      location: [''],
      address: [''],
      manager_name: [''],
      phone: ['']
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.depotId = +idParam;
      this.loadDepot();
    }
  }

  loadDepot(): void {
    this.loading = true;
    this.depotService.getById(this.depotId!).subscribe({
      next: (depot: Depot) => {
        this.depotForm.patchValue(depot);
        this.loading = false;
      },
      error: (err) => {
        this.showToast(err.message, 'danger');
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.depotForm.invalid) return;
    this.submitting = true;

    const request = this.depotId 
      ? this.depotService.update(this.depotId, this.depotForm.value)
      : this.depotService.create(this.depotForm.value);

    request.subscribe({
      next: () => {
        this.showToast('Depot saved successfully!', 'success');
        setTimeout(() => this.router.navigate(['/depots']), 1000);
      },
      error: (err) => {
        this.showToast(err.message, 'danger');
        this.submitting = false;
      }
    });
  }

  showToast(message: string, type: 'success' | 'danger') {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => this.toastMessage = '', 3000);
  }
}
