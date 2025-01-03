import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },

  divider: {
    height: 1,
    backgroundColor: 'black',
    marginVertical: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'red',
    padding: 10,
    fontSize: 30,
  },
  otpContainer: {
    flexDirection: 'row',
    gap: 20,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  otpWrapper: {
    width: 40,
    height: 50,
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  otpInput: {},
  otpInputHidden: {
    position: 'absolute',
    opacity: 0,
  },
  codeInputValue: {
    color: 'black',
    fontSize: 20,
  },
});
