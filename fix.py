import re

file_path = 'c:/Users/wajih/stock-monitoring/src/app/pages/stock/stock.component.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Restore the GLOBAL ACTION BUTTONS before NAVIGATION TABS
global_buttons = '''    <!-- ── GLOBAL ACTION BUTTONS ── -->
    <div class="d-flex flex-wrap gap-3 mb-4">
      <button class="btn btn-primary rounded-pill px-4 py-2 shadow-sm fw-bold" (click)="openProductModal(null)">
        + Add Product
      </button>
      <button class="btn btn-primary rounded-pill px-4 py-2 shadow-sm fw-bold" (click)="openAddStockModal()">
        + Add Stock
      </button>
      <button class="btn btn-primary rounded-pill px-4 py-2 shadow-sm fw-bold" (click)="openEtagereModal(null)">
        + New Shelf
      </button>
      <button class="btn btn-primary rounded-pill px-4 py-2 shadow-sm fw-bold" (click)="openTransferModal()">
        <i class="bi bi-arrow-repeat me-1"></i> Transfer to Shelf
      </button>
    </div>

    <!-- ── NAVIGATION TABS ── -->'''
content = content.replace('    <!-- ── NAVIGATION TABS ── -->', global_buttons)

# 2. Remove the Add Stock button from the Transfers tab
transfer_buttons_wrong = '''          <div class="d-flex gap-2">
            <button class="btn btn-primary text-white rounded-pill px-4 d-flex align-items-center gap-2 shadow-sm"
                    (click)="openAddStockModal()">
              <i class="fas fa-plus"></i> Add Stock
            </button>
            <button class="btn btn-info text-white rounded-pill px-4 d-flex align-items-center gap-2 shadow-sm"
                    (click)="openTransferModal()" id="addTransferBtn">
              <i class="fas fa-plus"></i> Nouveau Transfert
            </button>
          </div>'''

transfer_buttons_right = '''          <button class="btn btn-info text-white rounded-pill px-4 d-flex align-items-center gap-2 shadow-sm"
                  (click)="openTransferModal()" id="addTransferBtn">
            <i class="fas fa-plus"></i> Nouveau Transfert
          </button>'''
content = content.replace(transfer_buttons_wrong, transfer_buttons_right)

# 3. Fix the closing div issue in the Transfer Modal (line ~775)
transfer_modal_end_wrong = '''      <div class="d-flex gap-3">
        <button class="btn btn-light flex-grow-1 rounded-3 fw-semibold" (click)="showTransferModal = false">Annuler</button>
        <button class="btn btn-info text-white flex-grow-1 rounded-3 fw-semibold d-flex align-items-center justify-content-center gap-2"
                (click)="saveTransfer()" id="saveTransferBtn">
          <i class="bi bi-check-lg"></i> Valider le Transfert
        </button>
      </div>
      </div>
    </div>
  </div>
</div>'''

transfer_modal_end_right = '''      <div class="d-flex gap-3">
        <button class="btn btn-light flex-grow-1 rounded-3 fw-semibold" (click)="showTransferModal = false">Annuler</button>
        <button class="btn btn-info text-white flex-grow-1 rounded-3 fw-semibold d-flex align-items-center justify-content-center gap-2"
                (click)="saveTransfer()" id="saveTransferBtn">
          <i class="bi bi-check-lg"></i> Valider le Transfert
        </button>
      </div>
    </div>
  </div>
</div>'''
content = content.replace(transfer_modal_end_wrong, transfer_modal_end_right)

# 4. We previously had another extra div at line 82 which we correctly removed before. No need to touch it.

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('File updated successfully.')
