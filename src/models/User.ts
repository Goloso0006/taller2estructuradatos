export type Role = "Customer" | "Waiter" | "Chef" | "Cashier";

export abstract class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly role: Role,
  ) {}
}
