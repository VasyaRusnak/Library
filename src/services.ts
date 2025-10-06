import { Library } from './library';
import { Book } from './models';
import { User } from './models';

export class StorageService {
  constructor(private key = 'library_app_v1') {}

  save(books: Book[], users: User[]) {
    localStorage.setItem(this.key, JSON.stringify({ books, users }));
  }

  load(): { books: Book[]; users: User[] } | null {
    const raw = localStorage.getItem(this.key);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      return {
        books: (parsed.books || []).map(
          (b: any) => new Book(b.id, b.title, b.author, b.year, !!b.isBorrowed),
        ),
        users: (parsed.users || []).map(
          (u: any) => new User(u.id, u.name, u.email, u.borrowedIds || []),
        ),
      };
    } catch (e) {
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
