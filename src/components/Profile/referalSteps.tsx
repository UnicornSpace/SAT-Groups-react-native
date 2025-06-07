import { theme } from '@/infrastructure/themes';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const steps = [
  { id: 1, text: 'Share your link Or Scan the QR code' },
  { id: 2, text: 'Your friend will signup using your link' },
  { id: 3, text: 'You will get 100 points' },
];

const ReferralStepsVisual = () => {
  return (
    <View style={styles.container}>
      {steps.map((step, index) => (
        <View key={step.id} style={styles.stepContainer}>
          <View style={styles.circle}>
            <Text style={styles.circleText}>{step.id}</Text>
          </View>

          <View style={styles.lineContainer}>
            {index !== steps.length - 1 && <View style={styles.line} />}
          </View>

          <Text style={styles.text}>{step.text}</Text>
        </View>
      ))}
    </View>
  );
};

export default ReferralStepsVisual;

const styles = StyleSheet.create({
  container: {
    // padding: 20,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 30,
    position: 'relative',
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#2c3e50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  circleText: {
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  text: {
    flex: 1,
    fontSize: theme.fontSize.p2 ,
    color: '#000',
    lineHeight: 22,
    fontFamily:theme.fontFamily.medium
  },
  lineContainer: {
    position: 'absolute',
    top: 45,
    left: 15,
    height: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    width: 2,
    height: 40,
    backgroundColor: '#2c3e50',
  },
});
