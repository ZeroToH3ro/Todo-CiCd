import { range, pluck } from "../utils/utils";

describe('utils', () => {

  it("return correct range 1-5", () => {
    const result = range(1, 6);
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it("return not correct range", () => {
    const result = range(1, 9);
    expect(result).not.toEqual([1, 2, 3, 5]);
  });

  it('returns correct result', () => {
    const data = [
      { id: '1', name: 'foo' },
      { id: '2', name: 'bar' },
      { id: '3', name: 'baz' },
    ];
    expect(pluck(data, 'id')).toEqual(['1', '2', '3']);
  });
})
