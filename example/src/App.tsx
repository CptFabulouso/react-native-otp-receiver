import { useEffect } from 'react';
import { View, Button, Text } from 'react-native';
import {
  onSMSReceived,
  requestPhoneHint,
  expectSMSWithOTP,
} from 'react-native-otp-receiver';
import OTPProviderExample from './OTPProviderExample';
import OTPInputHandlerExample from './OTPHandlerExample';
import styles from './styles';

export default function App() {
  useEffect(() => {
    const listener = onSMSReceived((sms) => {
      console.log({ ...sms, time: new Date().toISOString() });
    });
    return () => {
      listener.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Button
        title="Phone Hint"
        onPress={async () => {
          try {
            const res = await requestPhoneHint().catch();
            console.log({ res });
          } catch (error) {
            console.error(error);
          }
        }}
      />
      <Button
        title="Expect SMS"
        onPress={async () => {
          const res = await expectSMSWithOTP();
          console.log({ res, time: new Date().toISOString() });
        }}
      />
      <View style={styles.divider} />
      <Text style={styles.title}>Input of shape [ABC] - [XYZ]</Text>
      <OTPProviderExample />
      <View style={styles.divider} />
      <Text style={styles.title}>Input of shape [A][B][C][X][Y][Z]</Text>
      <OTPInputHandlerExample />
    </View>
  );
}
