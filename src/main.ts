import { MenuCatalog } from "./modules/menu/MenuCatalog.js";
import { MenuItem } from "./modules/menu/MenuItem.js";
import { Cashier } from "./modules/users/Cashier.js";
import { Chef } from "./modules/users/Chef.js";
import { Customer } from "./modules/users/Customer.js";
import { Waiter } from "./modules/users/Waiter.js";
import { RestaurantWorkflow } from "./modules/workflow/RestaurantWorkflow.js";
import { AppView } from "./ui/AppView.js";

const menuCatalog = new MenuCatalog([
  new MenuItem("M-01", "Burger", 8.5),
  new MenuItem("M-02", "Salad", 6.25),
  new MenuItem("M-03", "Pasta", 9.75),
  new MenuItem("M-04", "Juice", 3.5),
]);

const customer = new Customer("U-01", "Alex", "Customer");
const waiter = new Waiter("U-02", "Sam", "Waiter");
const chef = new Chef("U-03", "Taylor", "Chef");
const cashier = new Cashier("U-04", "Jordan", "Cashier");

const workflow = new RestaurantWorkflow(customer, waiter, chef, cashier, menuCatalog);
const app = new AppView(workflow);

app.init();
