import { User } from "../../models/User.js";
import { Bill } from "../billing/Bill.js";
import { Order, OrderStatus } from "../order/Order.js";

export class Customer extends User {
  placeOrder(order: Order): void {
    order.updateStatus(OrderStatus.Placed, `${this.name} placed the order.`);
  }

  requestBill(order: Order): void {
    order.updateStatus(OrderStatus.BillRequested, `${this.name} requested the bill.`);
  }

  payOrder(order: Order, bill: Bill): void {
    if (!bill.isPaid()) {
      bill.markAsPaid();
    }
    order.updateStatus(OrderStatus.Paid, `${this.name} paid the order.`);
  }
}
