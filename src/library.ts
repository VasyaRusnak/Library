import { Book } from './models';
import { User } from './models';

export class Library<T extends { id: string }> {
  private items: T[] = [];

  constructor(initial: T[] = []) {
    this.items = initial.slice();
  }

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
    return this.items.slice();
  }
  clear() {
    this.items = [];
  }
}
