import { User } from "../../models/User.js";
import { Bill } from "../billing/Bill.js";
import { Order, OrderStatus } from "../order/Order.js";

export class Cashier extends User {
  calculateBill(order: Order, total: number): Bill {
    order.updateStatus(OrderStatus.BillCalculated, `${this.name} calculated the total: $${total.toFixed(2)}.`);
    return new Bill(order.id, total);
  }
}
