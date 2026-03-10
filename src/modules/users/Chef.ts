import { User } from "../../models/User.js";
import { Order, OrderStatus } from "../order/Order.js";

export class Chef extends User {
  prepareOrder(order: Order): void {
    order.updateStatus(OrderStatus.InPreparation, `${this.name} started preparing the order.`);
    order.updateStatus(OrderStatus.Ready, `${this.name} finished the order.`);
  }
}
