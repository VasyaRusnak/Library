export interface IBook {
  id: string;
  title: string;
  author: string;
  year: number;
  isBorrowed: boolean;
}

export class Book implements IBook {
  constructor(
    public id: string,
    public title: string,
    public author: string,
    public year: number,
    public isBorrowed = false,
  ) {}

  getSummary(): string {
    return `${this.title} — ${this.author} (${this.year})`;
  }

  borrow() {
    this.isBorrowed = true;
  }
  returned() {
    this.isBorrowed = false;
  }
}

export interface IUser {
  id: string; // лише цифри
  name: string;
  email: string;
  borrowedIds: string[];
}

export class User implements IUser {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public borrowedIds: string[] = [],
  ) {}

  canBorrow(): boolean {
    return this.borrowedIds.length < 3;
  }
  borrowBook(bookId: string) {
    this.borrowedIds.push(bookId);
  }
  returnBook(bookId: string) {
    this.borrowedIds = this.borrowedIds.filter((id) => id !== bookId);
  }
}
