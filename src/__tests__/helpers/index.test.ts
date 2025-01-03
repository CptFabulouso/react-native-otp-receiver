import { getPassedText } from '../../helpers';

describe('getPassedText', () => {
  it('correctly returns the passed text', () => {
    expect(getPassedText('1', '11234')).toBe('1234');
    // we'd like it to be '1234' but it's '2341' because we can't know which part of the string was passed
    expect(getPassedText('1', '12341')).toBe('2341');
    expect(getPassedText('2', '21234')).toBe('1234');
    expect(getPassedText('2', '12342')).toBe('1234');
    expect(getPassedText('3', '31234')).toBe('1234');
    expect(getPassedText('3', '12343')).toBe('1234');
    expect(getPassedText('4', '41234')).toBe('1234');
    expect(getPassedText('4', '12344')).toBe('1234');
    expect(getPassedText('5', '51234')).toBe('1234');
    expect(getPassedText('5', '12345')).toBe('1234');
    expect(getPassedText('6', '61234')).toBe('1234');
    expect(getPassedText('6', '12346')).toBe('1234');
    expect(getPassedText('7', '71234')).toBe('1234');
    expect(getPassedText('7', '12347')).toBe('1234');
    expect(getPassedText('8', '81234')).toBe('1234');
    expect(getPassedText('8', '12348')).toBe('1234');
    expect(getPassedText('9', '91234')).toBe('1234');
    expect(getPassedText('9', '12349')).toBe('1234');
  });
});
