import { Bill } from "../billing/Bill.js";
import { MenuCatalog } from "../menu/MenuCatalog.js";
import { MenuItem } from "../menu/MenuItem.js";
import { Order } from "../order/Order.js";
import { Cashier } from "../users/Cashier.js";
import { Chef } from "../users/Chef.js";
import { Customer } from "../users/Customer.js";
import { Waiter } from "../users/Waiter.js";

export type WorkflowAction =
  | "placeOrder"
  | "pickUpOrder"
  | "prepareOrder"
  | "serveOrder"
  | "customerRequestBill"
  | "waiterRequestBill"
  | "calculateBill"
  | "payOrder";

export class RestaurantWorkflow {
  private currentOrder: Order | null = null;
  private currentBill: Bill | null = null;
  private readonly processLog: string[] = [];

  constructor(
    private readonly customer: Customer,
    private readonly waiter: Waiter,
    private readonly chef: Chef,
    private readonly cashier: Cashier,
    private readonly menuCatalog: MenuCatalog,
  ) {}

  getMenuItems(): MenuItem[] {
    return this.menuCatalog.getItems();
  }

  getActors(): Array<{ role: string; name: string }> {
    return [
      { role: this.customer.role, name: this.customer.name },
      { role: this.waiter.role, name: this.waiter.name },
      { role: this.chef.role, name: this.chef.name },
      { role: this.cashier.role, name: this.cashier.name },
    ];
  }

  getOrder(): Order | null {
    return this.currentOrder;
  }

  getBill(): Bill | null {
    return this.currentBill;
  }

  getProcessLog(): string[] {
    if (!this.currentOrder) {
      return [...this.processLog];
    }

    return [...this.currentOrder.getHistory(), ...this.processLog];
  }

  getActionLabels(): Record<WorkflowAction, string> {
    return {
      placeOrder: "Place Order",
      pickUpOrder: "Waiter Picks Up",
      prepareOrder: "Kitchen Prepares",
      serveOrder: "Serve Order",
      customerRequestBill: "Customer Requests Bill",
      waiterRequestBill: "Waiter Asks Cashier",
      calculateBill: "Cashier Calculates Total",
      payOrder: "Pay Order",
    };
  }

  canRun(action: WorkflowAction): boolean {
    switch (action) {
      case "placeOrder":
        return this.currentOrder === null || this.currentBill?.isPaid() === true;
      case "pickUpOrder":
        return this.hasOrderWithStatus("Placed by Customer");
      case "prepareOrder":
        return this.hasOrderWithStatus("Picked up by Waiter");
      case "serveOrder":
        return this.hasOrderWithStatus("Ready to Serve");
      case "customerRequestBill":
        return this.hasOrderWithStatus("Served to Customer");
      case "waiterRequestBill":
        return this.hasOrderWithStatus("Bill Requested");
      case "calculateBill":
        return this.hasOrderWithStatus("Bill Requested to Cashier");
      case "payOrder":
        return this.hasOrderWithStatus("Bill Calculated") && this.currentBill !== null && !this.currentBill.isPaid();
      default:
        return false;
    }
  }

  placeOrder(selectedMenuItemIds: string[]): void {
    if (!this.canRun("placeOrder")) {
      throw new Error("A process is already running. Finish payment before creating a new order.");
    }

    if (selectedMenuItemIds.length === 0) {
      throw new Error("Select at least one menu item before placing an order.");
    }

    const items = this.menuCatalog.getByIds(selectedMenuItemIds);
    if (items.length === 0) {
      throw new Error("The selected menu items are invalid.");
    }

    this.currentOrder = new Order(`ORD-${Date.now()}`, items);
    this.currentBill = null;
    this.customer.placeOrder(this.currentOrder);
  }

  pickUpOrder(): void {
    const order = this.requireOrder("pickUpOrder");
    this.waiter.pickUpOrder(order);
  }

  prepareOrder(): void {
    const order = this.requireOrder("prepareOrder");
    this.chef.prepareOrder(order);
  }

  serveOrder(): void {
    const order = this.requireOrder("serveOrder");
    this.waiter.serveOrder(order);
  }

  customerRequestBill(): void {
    const order = this.requireOrder("customerRequestBill");
    this.customer.requestBill(order);
  }

  waiterRequestBill(): void {
    const order = this.requireOrder("waiterRequestBill");
    this.waiter.requestBillToCashier(order);
  }

  calculateBill(): void {
    const order = this.requireOrder("calculateBill");
    const total = this.menuCatalog.getTotal(order.getItemIds());
    this.currentBill = this.cashier.calculateBill(order, total);
    this.processLog.push(`Receipt generated for ${order.id}.`);
  }

  payOrder(): void {
    const order = this.requireOrder("payOrder");
    if (!this.currentBill) {
      throw new Error("Bill does not exist yet.");
    }

    this.customer.payOrder(order, this.currentBill);
    this.processLog.push(`Process finished for ${order.id}.`);
  }

  private requireOrder(action: WorkflowAction): Order {
    if (!this.currentOrder) {
      throw new Error("No active order in process.");
    }

    if (!this.canRun(action)) {
      throw new Error("Invalid action for current process status.");
    }

    return this.currentOrder;
  }

  private hasOrderWithStatus(status: string): boolean {
    return this.currentOrder?.getStatus() === status;
  }
}
