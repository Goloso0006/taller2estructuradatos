import { User } from "../../models/User.js";
import { Order, OrderStatus } from "../order/Order.js";

export class Waiter extends User {
  pickUpOrder(order: Order): void {
    order.updateStatus(OrderStatus.PickedUp, `${this.name} picked up the order.`);
  }

  serveOrder(order: Order): void {
    order.updateStatus(OrderStatus.Served, `${this.name} served the order.`);
  }

  requestBillToCashier(order: Order): void {
    order.updateStatus(OrderStatus.BillAskedToCashier, `${this.name} asked cashier for the bill.`);
  }
}
