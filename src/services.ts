import { Library } from './library';
import { Book, User } from './models';

export class StorageService {
  constructor(private key = 'library_app_v1') {}

  save(books: Book[], users: User[]) {
    localStorage.setItem(this.key, JSON.stringify({ books, users }));
  }

  load(): { books: Book[]; users: User[] } | null {
    const raw = localStorage.getItem(this.key);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as {
        books: { id: string; title: string; author: string; year: number; isBorrowed: boolean }[];
        users: { id: string; name: string; email: string; borrowedIds: string[] }[];
      };

      return {
        books: parsed.books.map((b) => new Book(b.id, b.title, b.author, b.year, !!b.isBorrowed)),
        users: parsed.users.map((u) => new User(u.id, u.name, u.email, u.borrowedIds || [])),
      };
    } catch {
      return null;
    }
  }

  clear() {
    localStorage.removeItem(this.key);
  }
}

export class LoanService {
  constructor(
    private books: Library<Book>,
    private users: Library<User>,
    private storage: StorageService,
  ) {}

  borrow(userId: string, bookId: string) {
    const user = this.users.findById(userId);
    const book = this.books.findById(bookId);
    if (!user) return { ok: false, message: 'Користувач не знайдений' };
    if (!book) return { ok: false, message: 'Книга не знайдена' };
    if (book.isBorrowed) return { ok: false, message: 'Книга вже позичена' };
    if (!user.canBorrow()) return { ok: false, message: 'Ліміт — 3 книги' };

    book.borrow();
    user.borrowBook(book.id);
    this.persist();
    return { ok: true, message: 'Книгу успішно позичено' };
  }

  returnBook(userId: string, bookId: string) {
    const user = this.users.findById(userId);
    const book = this.books.findById(bookId);
    if (!user || !book) return { ok: false, message: 'Не знайдено' };
    book.returned();
    user.returnBook(bookId);
    this.persist();
    return { ok: true, message: 'Книгу повернено' };
  }

  persist() {
    this.storage.save(this.books.list(), this.users.list());
  }
}
