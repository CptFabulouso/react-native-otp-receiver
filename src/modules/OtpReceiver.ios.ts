export const requestPhoneHint = () => {
  return Promise.reject(new Error('Unavailable on iOS'));
};

export const expectSMSWithOTP = () => false;

export const onSMSReceived = () => {
  return {
    remove: () => {},
  };
};
