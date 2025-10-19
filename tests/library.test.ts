/* eslint-disable @typescript-eslint/no-require-imports */
const { expect } = require('chai');
const { Library } = require('../src/library');

describe('Library', () => {
  it('should add an item', () => {
    const lib = new Library();
    lib.add({ id: '1' });
    expect(lib.list()).to.have.lengthOf(1);
  });

  it('should remove an item by id', () => {
    const lib = new Library();
    lib.add({ id: '1' });
    lib.remove('1');
    expect(lib.list()).to.have.lengthOf(0);
  });

  it('should find item by id', () => {
    const lib = new Library();
    lib.add({ id: 'x' });
    expect(lib.findById('x')).to.deep.equal({ id: 'x' });
  });
});
