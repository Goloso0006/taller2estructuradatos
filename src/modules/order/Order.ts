import { MenuItem } from "../menu/MenuItem.js";

export enum OrderStatus {
  Draft = "Draft",
  Placed = "Placed by Customer",
  PickedUp = "Picked up by Waiter",
  InPreparation = "In Preparation",
  Ready = "Ready to Serve",
  Served = "Served to Customer",
  BillRequested = "Bill Requested",
  BillAskedToCashier = "Bill Requested to Cashier",
  BillCalculated = "Bill Calculated",
  Paid = "Paid",
}

export class Order {
  private status: OrderStatus = OrderStatus.Draft;
  private readonly history: string[] = [];

  constructor(
    public readonly id: string,
    public readonly items: MenuItem[],
  ) {
    this.addHistory(`Order ${id} created.`);
  }

  updateStatus(newStatus: OrderStatus, message: string): void {
    this.status = newStatus;
    this.addHistory(message);
  }

  getStatus(): OrderStatus {
    return this.status;
  }

  getItemIds(): string[] {
    return this.items.map((item) => item.id);
  }

  getItemsSummary(): string {
    return this.items.map((item) => `${item.name} ($${item.price.toFixed(2)})`).join(", ");
  }

  getHistory(): string[] {
    return [...this.history];
  }

  private addHistory(event: string): void {
    const timestamp = new Date().toLocaleTimeString();
    this.history.push(`${timestamp} - ${event}`);
  }
}
