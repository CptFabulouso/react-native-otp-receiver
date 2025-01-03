import { getPastedText } from '../../helpers';

describe('getPastedText', () => {
  it('correctly returns the passed text', () => {
    expect(getPastedText('1', '11234')).toBe('1234');
    // we'd like it to be '1234' but it's '2341' because we can't know which part of the string was passed
    expect(getPastedText('1', '12341')).toBe('2341');
    expect(getPastedText('2', '21234')).toBe('1234');
    expect(getPastedText('2', '12342')).toBe('1234');
    expect(getPastedText('123', '1231234')).toBe('1234');
    // we'd like it to be '1234' but it's '4123' because we can't know which part of the string was passed
    expect(getPastedText('123', '1234123')).toBe('4123');
    expect(getPastedText('222', '2221234')).toBe('1234');
    expect(getPastedText('222', '1234222')).toBe('1234');
  });
});
