import { expect } from 'chai';
import { Library } from '../src/library'; // ../src/library.ts
import { Book } from '../src/models'; // ../src/models.ts

describe('Library', () => {
  let library: Library<Book>;

  beforeEach(() => {
    library = new Library<Book>();
  });

  it('should add a book', () => {
    const book = new Book('1', 'Book 1', 'Author A', 2020);
    library.add(book);
    expect(library.list()).to.have.lengthOf(1);
    expect(library.findById('1')).to.equal(book);
  });

  it('should remove a book', () => {
    const book = new Book('1', 'Book 1', 'Author A', 2020);
    library.add(book);
    library.remove('1');
    expect(library.list()).to.have.lengthOf(0);
    expect(library.findById('1')).to.be.undefined;
  });

  it('should return a list of books', () => {
    const book1 = new Book('1', 'Book 1', 'Author A', 2020);
    const book2 = new Book('2', 'Book 2', 'Author B', 2021);
    library.add(book1);
    library.add(book2);
    const list = library.list();
    expect(list).to.have.lengthOf(2);
    expect(list).to.include(book1);
    expect(list).to.include(book2);
  });
});
