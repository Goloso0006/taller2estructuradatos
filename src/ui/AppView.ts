import { Bill } from "../modules/billing/Bill.js";
import { Order } from "../modules/order/Order.js";
import { RestaurantWorkflow, WorkflowAction } from "../modules/workflow/RestaurantWorkflow.js";

export class AppView {
  private readonly actorsPanel: HTMLElement;
  private readonly menuItemsContainer: HTMLElement;
  private readonly actionsContainer: HTMLElement;
  private readonly statusText: HTMLElement;
  private readonly orderItemsText: HTMLElement;
  private readonly billText: HTMLElement;
  private readonly processLog: HTMLElement;

  private readonly actionButtons = new Map<WorkflowAction, HTMLButtonElement>();

  private readonly actionOrder: WorkflowAction[] = [
    "placeOrder",
    "pickUpOrder",
    "prepareOrder",
    "serveOrder",
    "customerRequestBill",
    "waiterRequestBill",
    "calculateBill",
    "payOrder",
  ];

  constructor(private readonly workflow: RestaurantWorkflow) {
    this.actorsPanel = this.getRequiredElement("actors-panel");
    this.menuItemsContainer = this.getRequiredElement("menu-items");
    this.actionsContainer = this.getRequiredElement("actions");
    this.statusText = this.getRequiredElement("status-text");
    this.orderItemsText = this.getRequiredElement("order-items");
    this.billText = this.getRequiredElement("bill-text");
    this.processLog = this.getRequiredElement("process-log");
  }

  init(): void {
    this.renderActors();
    this.renderMenu();
    this.renderActions();
    this.refresh();
  }

  private renderActors(): void {
    const actors = this.workflow.getActors();

    this.actorsPanel.innerHTML = `
      <h2>Actors</h2>
      <div class="actors-grid">
        ${actors
          .map(
            (actor) => `
              <article class="actor-card">
                <strong>${actor.role}</strong>
                <p>${actor.name}</p>
              </article>
            `,
          )
          .join("")}
      </div>
    `;
  }

  private renderMenu(): void {
    const items = this.workflow.getMenuItems();

    this.menuItemsContainer.innerHTML = "";
    for (const item of items) {
      const label = document.createElement("label");
      label.className = "menu-item";

      const input = document.createElement("input");
      input.type = "checkbox";
      input.value = item.id;
      input.className = "menu-checkbox";

      const text = document.createElement("span");
      text.textContent = `${item.name} - $${item.price.toFixed(2)}`;

      label.append(input, text);
      this.menuItemsContainer.appendChild(label);
    }
  }

  private renderActions(): void {
    const labels = this.workflow.getActionLabels();
    this.actionsContainer.innerHTML = "";

    for (const action of this.actionOrder) {
      const button = document.createElement("button");
      button.textContent = labels[action];
      button.addEventListener("click", () => this.handleAction(action));
      this.actionsContainer.appendChild(button);
      this.actionButtons.set(action, button);
    }
  }

  private handleAction(action: WorkflowAction): void {
    try {
      switch (action) {
        case "placeOrder": {
          const selectedIds = this.getSelectedMenuItemIds();
          this.workflow.placeOrder(selectedIds);
          break;
        }
        case "pickUpOrder":
          this.workflow.pickUpOrder();
          break;
        case "prepareOrder":
          this.workflow.prepareOrder();
          break;
        case "serveOrder":
          this.workflow.serveOrder();
          break;
        case "customerRequestBill":
          this.workflow.customerRequestBill();
          break;
        case "waiterRequestBill":
          this.workflow.waiterRequestBill();
          break;
        case "calculateBill":
          this.workflow.calculateBill();
          break;
        case "payOrder":
          this.workflow.payOrder();
          break;
      }

      this.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error.";
      window.alert(message);
    }
  }

  private refresh(): void {
    this.renderStatus(this.workflow.getOrder(), this.workflow.getBill());
    this.renderLogs(this.workflow.getProcessLog());
    this.updateActionAvailability();
  }

  private renderStatus(order: Order | null, bill: Bill | null): void {
    if (!order) {
      this.statusText.textContent = "No order created.";
      this.orderItemsText.textContent = "";
      this.billText.textContent = "";
      return;
    }

    this.statusText.textContent = `Order ${order.id}: ${order.getStatus()}`;
    this.orderItemsText.textContent = `Items: ${order.getItemsSummary()}`;

    if (bill) {
      this.billText.textContent = `Bill Total: $${bill.total.toFixed(2)} | Paid: ${bill.isPaid() ? "Yes" : "No"}`;
    } else {
      this.billText.textContent = "Bill Total: Pending";
    }
  }

  private renderLogs(entries: string[]): void {
    this.processLog.innerHTML = "";

    for (const entry of entries.slice().reverse()) {
      const li = document.createElement("li");
      li.textContent = entry;
      this.processLog.appendChild(li);
    }
  }

  private updateActionAvailability(): void {
    for (const [action, button] of this.actionButtons.entries()) {
      button.disabled = !this.workflow.canRun(action);
    }
  }

  private getSelectedMenuItemIds(): string[] {
    const checkboxes = this.menuItemsContainer.querySelectorAll<HTMLInputElement>(".menu-checkbox:checked");
    return Array.from(checkboxes).map((checkbox) => checkbox.value);
  }

  private getRequiredElement(id: string): HTMLElement {
    const element = document.getElementById(id);
    if (!element) {
      throw new Error(`Missing element with id: ${id}`);
    }

    return element;
  }
}
