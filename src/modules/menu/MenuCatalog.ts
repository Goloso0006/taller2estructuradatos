import { MenuItem } from "./MenuItem.js";

export class MenuCatalog {
  private readonly items: MenuItem[];

  constructor(items: MenuItem[]) {
    this.items = items;
  }

  getItems(): MenuItem[] {
    return [...this.items];
  }

  getByIds(ids: string[]): MenuItem[] {
    const idSet = new Set(ids);
    return this.items.filter((item) => idSet.has(item.id));
  }

  getTotal(ids: string[]): number {
    return this.getByIds(ids).reduce((acc, item) => acc + item.price, 0);
  }
}
