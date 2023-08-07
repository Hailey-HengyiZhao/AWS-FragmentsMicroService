const MemoryDB = require('../../src/model/data/memory/memory-db');
const {
  writeFragment,
  readFragment,
  writeFragmentData,
  readFragmentData,
  listFragments,
  deleteFragment,
} = require('../../src/model/data/memory/index');

describe('memory-db', () => {
  let db;

  // Each test will get its own, empty database instance
  beforeEach(() => {
    db = new MemoryDB();
  });

  // Testing writeFragment function: Meta Data
  // Successfully return resolve
  test('Testing writeFragment function dealing with meta data', async () => {
    const fragment = {
      ownerId: 'a',
      id: 'b',
      data: {},
    };
    const result = await writeFragment(fragment);
    expect(result).toBe(undefined);
  });

  // Testing readFragment function: Meta Data
  // Successfully return the fragment
  test('Testing readFragment function dealing with meta data', async () => {
    const fragment = {
      ownerId: 'a',
      id: 'b',
    };
    await writeFragment(fragment);
    const result = await readFragment(fragment.ownerId, fragment.id);
    expect(result).toEqual(fragment);
  });

  // Testing writeFragmentData function: raw data
  // Successfully return resolve with undefined
  test('Testing writeFragmentData dealing with raw data', async () => {
    const data = Buffer.from([1, 2, 3]);
    const fragment = {
      ownerId: 'a',
      id: 'b',
      data: data,
    };
    const result = await writeFragmentData(fragment.ownerId, fragment.id, fragment.data);
    expect(result).toBe(undefined);
  });

  // Testing readFragmentData function: raw data
  // Successfully return resolve with the value
  test('Testing readFragmentData dealing with raw data', async () => {
    const data = Buffer.from([1, 2, 3]);
    const fragment = {
      ownerId: 'a',
      id: 'b',
      data: data,
    };
    await writeFragmentData(fragment.ownerId, fragment.id, fragment.data);
    const result = await readFragmentData(fragment.ownerId, fragment.id);
    expect(result).toEqual(data);
  });

  // Testing listFragments function: raw data
  // Successfully return resolve with the value
  test('Testing listFragments function', async () => {
    const fragments = [
      { ownerId: 'a', id: 'b', data: {} },
      { ownerId: 'a', id: 'c', data: {} },
      { ownerId: 'a', id: 'd', data: {} },
    ];
    await Promise.all(fragments.map(writeFragment));
    const result = await listFragments('a');
    const expectedIds = fragments.map((fragment) => fragment.id);
    expect(result).toEqual(expectedIds);
  });

  // Testing deleteFragment function: metadata & raw data
  // Successfully return resolve
  test('Testing deleteFragment dealing with raw and meta data', async () => {
    const data = Buffer.from([1, 2, 3]);
    const fragment = {
      ownerId: 'a',
      id: 'b',
    };
    await writeFragment(fragment);
    await writeFragmentData(fragment.ownerId, fragment.id, data);
    const result = await deleteFragment(fragment.ownerId, fragment.id);
    expect(result).toEqual([undefined, undefined]);
  });

  //Some wrong input implementation
  //Testing writeFragment: Wrong ownerId and id type and reject
  test('Testing writeFragment function with wrong input and reject', async () => {
    const fragment = {
      ownerId: 1,
      id: 1,
      data: {},
    };
    expect(async () => await db.writeFragment(fragment)).rejects.toThrow();
  });

  // Testing writeFragment: Missing parts and reject
  test('Testing writeFragment function with missing parts and reject', async () => {
    const fragments = [
      { ownerId: 'a', data: {} },
      { id: 'c', data: {} },
    ];
    expect(async () => await Promise.all(fragments.map(writeFragment))).rejects.toThrow();
  });
});
