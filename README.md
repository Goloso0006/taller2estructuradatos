# Restaurant Flow App (OOP + Modular)

Basic frontend application using **Object-Oriented Programming (OOP)** and a **modular architecture**, based on the restaurant service flow in your diagram.

## Modules

- `models`: base domain models (`User`)
- `modules/users`: actors (`Customer`, `Waiter`, `Chef`, `Cashier`)
- `modules/menu`: menu and catalog
- `modules/order`: order lifecycle and status
- `modules/billing`: bill entity
- `modules/workflow`: orchestration of the restaurant process
- `ui`: DOM rendering and interaction handling

## Process implemented

1. Place order (Customer)
2. Waiter picks up order
3. Kitchen prepares order
4. Waiter serves order
5. Customer requests bill
6. Waiter asks cashier
7. Cashier calculates total
8. Customer pays

## Run

```bash
npm install
npm run build
npm run serve
```

Then open: `http://localhost:5173`
