import { Book, User } from './models';
import { Library } from './library';
import { StorageService, LoanService } from './services';
import { Validators } from './validation';
import { showModal } from './modal';

const booksLib = new Library<Book>();
const usersLib = new Library<User>();
const storage = new StorageService();
const loan = new LoanService(booksLib, usersLib, storage);

// load from storage
const saved = storage.load();
if (saved) {
  saved.books.forEach((b) => booksLib.add(b));
  saved.users.forEach((u) => usersLib.add(u));
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function render() {
  const app = document.getElementById('app')!;
  app.innerHTML = `
    <div class="row">
      <div class="col-md-6">
        <div class="card mb-3"><div class="card-body">
          <h5 class="card-title">Додати Книгу</h5>
          <div class="mb-2"><input id="book-title" class="form-control" placeholder="Назва книги"></div>
          <div class="mb-2"><input id="book-author" class="form-control" placeholder="Автор"></div>
          <div class="mb-2"><input id="book-year" class="form-control" placeholder="Рік видання"></div>
          <button id="add-book" class="btn btn-success">Додати Книгу</button>
        </div></div>

        <div class="card"><div class="card-body">
          <h5 class="card-title">Список Книг</h5>
          <ul id="book-list" class="list-group"></ul>
        </div></div>
      </div>

      <div class="col-md-6">
        <div class="card mb-3"><div class="card-body">
          <h5 class="card-title">Додати Користувача</h5>
          <div class="mb-2"><input id="user-id" class="form-control" placeholder="ID (лише цифри)"></div>
          <div class="mb-2"><input id="user-name" class="form-control" placeholder="Ім'я"></div>
          <div class="mb-2"><input id="user-email" class="form-control" placeholder="Email"></div>
          <button id="add-user" class="btn btn-success">Додати Користувача</button>
        </div></div>

        <div class="card"><div class="card-body">
          <h5 class="card-title">Список Користувачів</h5>
          <ul id="user-list" class="list-group"></ul>
        </div></div>
      </div>
    </div>
  `;

  bind();
  refreshLists();
}
function bind() {
  // Додавання книги
  (document.getElementById('add-book') as HTMLButtonElement).onclick = () => {
    const title = (document.getElementById('book-title') as HTMLInputElement).value;
    const author = (document.getElementById('book-author') as HTMLInputElement).value;
    const year = (document.getElementById('book-year') as HTMLInputElement).value;

    const errors: string[] = [];
    if (!Validators.required(title)) errors.push("Назва обов'язкова");
    if (!Validators.required(author)) errors.push("Автор обов'язковий");
    if (!Validators.year(year)) errors.push('Рік повинен бути у форматі: 4 цифри');

    if (errors.length) {
      showModal('Помилка', errors.join('<br>'));
      return;
    }

    const b = new Book(uid(), title.trim(), author.trim(), parseInt(year, 10));
    booksLib.add(b);
    storage.save(booksLib.list(), usersLib.list());
    refreshLists();
    showModal('Успіх', 'Книгу додано');

    (document.getElementById('book-title') as HTMLInputElement).value = '';
    (document.getElementById('book-author') as HTMLInputElement).value = '';
    (document.getElementById('book-year') as HTMLInputElement).value = '';
    (document.getElementById('book-title') as HTMLInputElement).focus();
  };

  (document.getElementById('add-user') as HTMLButtonElement).onclick = () => {
    const id = (document.getElementById('user-id') as HTMLInputElement).value;
    const name = (document.getElementById('user-name') as HTMLInputElement).value;
    const email = (document.getElementById('user-email') as HTMLInputElement).value;

    const errors: string[] = [];
    if (!Validators.required(id)) errors.push("ID обов'язковий");
    if (!Validators.numeric(id)) errors.push('ID — лише цифри');
    if (!Validators.required(name)) errors.push("Ім'я обов'язкове");
    if (!Validators.email(email)) errors.push('Невірний email');

    if (errors.length) {
      showModal('Помилка', errors.join('<br>'));
      return;
    }
    if (usersLib.findById(id)) {
      showModal('Помилка', 'Користувач з таким ID вже існує');
      return;
    }

    const u = new User(id.trim(), name.trim(), email.trim());
    usersLib.add(u);
    storage.save(booksLib.list(), usersLib.list());
    refreshLists();
    showModal('Успіх', 'Користувача додано');

    (document.getElementById('user-id') as HTMLInputElement).value = '';
    (document.getElementById('user-name') as HTMLInputElement).value = '';
    (document.getElementById('user-email') as HTMLInputElement).value = '';
    (document.getElementById('user-id') as HTMLInputElement).focus();
  };
}

function refreshLists() {
  const bl = document.getElementById('book-list')!;
  bl.innerHTML = '';
  booksLib.list().forEach((b) => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.innerHTML = `
      <div>
        <strong>${b.title}</strong> — ${b.author} (${b.year}) ${b.isBorrowed ? '<span class="badge bg-warning ms-2">Позичена</span>' : ''}
      </div>
      <div>
        <button class="btn btn-sm btn-primary borrow-btn" data-id="${b.id}">${b.isBorrowed ? 'Повернути' : 'Позичити'}</button>
        <button class="btn btn-sm btn-danger ms-2 delete-book" data-id="${b.id}">Видалити</button>
      </div>
    `;
    bl.appendChild(li);
  });

  const ul = document.getElementById('user-list')!;
  ul.innerHTML = '';
  usersLib.list().forEach((u) => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.innerHTML = `
      <div>
        <strong>${u.name}</strong> (ID: ${u.id}) — ${u.email} <br>
        Позичено: ${u.borrowedIds.length}
      </div>
      <div>
        <button class="btn btn-sm btn-danger delete-user" data-id="${u.id}">Видалити</button>
      </div>
    `;
    ul.appendChild(li);
  });

  // bind dynamic buttons
  document.querySelectorAll('.borrow-btn').forEach((b) =>
    b.addEventListener('click', (ev) => {
      const id = (ev.currentTarget as HTMLElement).getAttribute('data-id')!;
      const book = booksLib.findById(id)!;
      if (!book.isBorrowed) {
        const userId = prompt('Введіть ID користувача, який позичає книгу (лише цифри):');
        if (!userId) return;
        const res = loan.borrow(userId.trim(), id);
        showModal(res.ok ? 'Успіх' : 'Помилка', res.message);
      } else {
        const users = usersLib.list();
        const owner = users.find((u) => u.borrowedIds.includes(id));
        if (!owner) {
          showModal('Помилка', 'Не знайдено користувача, що позичив цю книгу');
          return;
        }
        const res = loan.returnBook(owner.id, id);
        showModal(res.ok ? 'Успіх' : 'Помилка', res.message);
      }
      refreshLists();
    }),
  );

  document.querySelectorAll('.delete-book').forEach((b) =>
    b.addEventListener('click', (ev) => {
      const id = (ev.currentTarget as HTMLElement).getAttribute('data-id')!;
      if (!confirm('Видалити книгу?')) return;
      usersLib.list().forEach((u) => {
        u.returnBook(id);
      });
      booksLib.remove(id);
      storage.save(booksLib.list(), usersLib.list());
      refreshLists();
    }),
  );

  document.querySelectorAll('.delete-user').forEach((b) =>
    b.addEventListener('click', (ev) => {
      const id = (ev.currentTarget as HTMLElement).getAttribute('data-id')!;
      if (!confirm('Видалити користувача? Всі його позичання будуть зняті.')) return;
      const user = usersLib.findById(id);
      if (user) {
        user.borrowedIds.forEach((bookId) => {
          const bk = booksLib.findById(bookId);
          if (bk) bk.returned();
        });
      }
      usersLib.remove(id);
      storage.save(booksLib.list(), usersLib.list());
      refreshLists();
    }),
  );
}

// initial render
render();
