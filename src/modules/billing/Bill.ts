export class Bill {
  private paid = false;

  constructor(
    public readonly orderId: string,
    public readonly total: number,
  ) {}

  markAsPaid(): void {
    this.paid = true;
  }

  isPaid(): boolean {
    return this.paid;
  }
}
