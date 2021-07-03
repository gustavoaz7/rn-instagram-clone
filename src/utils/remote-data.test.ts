import {
  makePending,
  makeSuccess,
  makeFail,
  makeUninitialized,
  isPending,
  isSuccess,
  isFail,
  isInitialized,
  STATUS,
} from './remote-data';

describe('utils - remote-data', () => {
  it('makePending', () => {
    const data = 'content';
    const output = makePending(data);

    expect(output.status).toBe(STATUS.PENDING);
    expect(output.data).toBe(data);
    expect(output.error).toBe(null);
  });

  it('makeSuccess', () => {
    const payload = 'content';
    const output = makeSuccess(payload);

    expect(output.status).toBe(STATUS.SUCCESS);
    expect(output.data).toBe(payload);
    expect(output.error).toBe(null);
  });

  it('makeFail', () => {
    const error = new Error('something');
    const output = makeFail(error);

    expect(output.status).toBe(STATUS.FAIL);
    expect(output.data).toBe(null);
    expect(output.error).toBe(error);
  });

  it('makeUninitialized', () => {
    const output = makeUninitialized();

    expect(output.status).toBe(null);
    expect(output.data).toBe(null);
    expect(output.error).toBe(null);
  });

  it('isPending', () => {
    expect(isPending(makePending())).toBe(true);
    expect(isPending(makeSuccess(''))).toBe(false);
    expect(isPending(makeFail(new Error('')))).toBe(false);
    expect(isPending(makeUninitialized())).toBe(false);
  });

  it('isSuccess', () => {
    expect(isSuccess(makePending())).toBe(false);
    expect(isSuccess(makeSuccess(''))).toBe(true);
    expect(isSuccess(makeFail(new Error('')))).toBe(false);
    expect(isSuccess(makeUninitialized())).toBe(false);
  });

  it('isFail', () => {
    expect(isFail(makePending())).toBe(false);
    expect(isFail(makeSuccess(''))).toBe(false);
    expect(isFail(makeFail(new Error('')))).toBe(true);
    expect(isFail(makeUninitialized())).toBe(false);
  });

  it('isInitialized', () => {
    expect(isInitialized(makePending())).toBe(true);
    expect(isInitialized(makeSuccess(''))).toBe(true);
    expect(isInitialized(makeFail(new Error('')))).toBe(true);
    expect(isInitialized(makeUninitialized())).toBe(false);
  });
});
