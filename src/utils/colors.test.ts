import { addAlphaToHEX } from './color';

describe('utils - colors', () => {
  describe('when hex is not valid', () => {
    it('returns provided hex value', () => {
      expect(addAlphaToHEX('#12', 1)).toEqual('#12');
      expect(addAlphaToHEX('#12345', 1)).toEqual('#12345');
      expect(addAlphaToHEX('something else', 1)).toEqual('something else');
    });
  });

  describe('when alpha is not valid', () => {
    it('returns provided hex value', () => {
      expect(addAlphaToHEX('#000000', -0.2)).toEqual('#000000');
      expect(addAlphaToHEX('#000000', 1.5)).toEqual('#000000');
    });
  });

  it('adds alpha to hex', () => {
    expect(addAlphaToHEX('#123456', 0.5)).toEqual('#12345680');
    expect(addAlphaToHEX('#123', 0.11)).toEqual('#1122331c');
    expect(addAlphaToHEX('#bad', 0.85)).toEqual('#bbaaddd9');
  });
});
