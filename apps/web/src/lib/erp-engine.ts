/**
 * Centralized ERP Core Engine
 * Manages modular cross-department state and real-time automated workflows.
 */

export interface SystemEvent {
  id: string;
  timestamp: string;
  sourceModule: 'SALES' | 'INVENTORY' | 'FINANCE' | 'LOGISTICS' | 'MANUFACTURING' | 'HR';
  action: string;
  payload: Record<string, any>;
}

export interface ERPState {
  cashBalance: number;
  unpaidInvoices: number;
  rawMaterialsStock: number;
  finishedGoodsStock: number;
  activeShipments: number;
  pendingWorkOrders: number;
}

class ERPEngine {
  private state: ERPState = {
    cashBalance: 125000.00,
    unpaidInvoices: 18400.00,
    rawMaterialsStock: 1450,
    finishedGoodsStock: 320,
    activeShipments: 14,
    pendingWorkOrders: 6,
  };

  private eventLog: SystemEvent[] = [
    {
      id: 'EVT-9001',
      timestamp: new Date().toLocaleTimeString(),
      sourceModule: 'SALES',
      action: 'Sales Order Placed #ORD-9912',
      payload: { amount: 4999, items: 2, itemType: 'Finished Goods' },
    },
    {
      id: 'EVT-9002',
      timestamp: new Date().toLocaleTimeString(),
      sourceModule: 'INVENTORY',
      action: 'Finished Goods Inventory Decremented (-2 Units)',
      payload: { sku: 'HW-SRV-2U', remaining: 318 },
    },
    {
      id: 'EVT-9003',
      timestamp: new Date().toLocaleTimeString(),
      sourceModule: 'FINANCE',
      action: 'Auto-Generated Invoice #INV-2026-9912',
      payload: { status: 'PENDING_PAYMENT', dueDate: '14 Days' },
    },
    {
      id: 'EVT-9004',
      timestamp: new Date().toLocaleTimeString(),
      sourceModule: 'LOGISTICS',
      action: 'Dispatch Queued & Shipping Manifest Generated',
      payload: { carrier: 'FedEx Freight', trackingId: 'TRK-881920' },
    },
  ];

  getState(): ERPState {
    return { ...this.state };
  }

  getEventLog(): SystemEvent[] {
    return [...this.eventLog];
  }

  /**
   * Real-Time Workflow Sync Mechanism
   * Executes multi-department updates from a single order event
   */
  processCustomerSale(orderId: string, amount: number, qty: number) {
    const time = new Date().toLocaleTimeString();

    // 1. Update Core Metrics
    this.state.finishedGoodsStock -= qty;
    this.state.unpaidInvoices += amount;
    this.state.activeShipments += 1;

    // 2. Cascade Events Across Departments
    const newEvents: SystemEvent[] = [
      {
        id: `EVT-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: time,
        sourceModule: 'SALES',
        action: `New Order Received (${orderId})`,
        payload: { orderId, amount, qty },
      },
      {
        id: `EVT-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: time,
        sourceModule: 'INVENTORY',
        action: `Inventory Updated: Auto-deducted ${qty} finished unit(s)`,
        payload: { stockRemaining: this.state.finishedGoodsStock },
      },
      {
        id: `EVT-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: time,
        sourceModule: 'FINANCE',
        action: `Ledger Updated: Invoice $${amount.toLocaleString()} created`,
        payload: { accountsReceivable: this.state.unpaidInvoices },
      },
      {
        id: `EVT-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: time,
        sourceModule: 'LOGISTICS',
        action: `Logistics Dispatch: Auto-created shipping slip for ${orderId}`,
        payload: { status: 'READY_FOR_PICKUP' },
      },
    ];

    this.eventLog = [...newEvents, ...this.eventLog];
    return { state: this.state, events: this.eventLog };
  }
}

export const erpEngine = new ERPEngine();