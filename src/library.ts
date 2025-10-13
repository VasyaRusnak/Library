import { Book } from './models';

export class Library<T extends { id: string }> {
  private items: T[] = [];

  add(item: T) {
    this.items.push(item);
  }
  remove(id: string) {
    this.items = this.items.filter((i) => i.id !== id);
  }
  findById(id: string): T | undefined {
    return this.items.find((i) => i.id === id);
  }
  list(): T[] {
    return [...this.items]; // test lint-stagel
  }
  clear() {
    this.items = [];
  }
}
