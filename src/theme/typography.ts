import { Platform, TextStyle } from 'react-native';

const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

export const typography = {
  h1: {
    fontSize: 26,
    fontWeight: '700',
    fontFamily,
    lineHeight: 32,
  } as TextStyle,
  h2: {
    fontSize: 19,
    fontWeight: '600',
    fontFamily,
    lineHeight: 24,
  } as TextStyle,
  body: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily,
    lineHeight: 22,
  } as TextStyle,
  small: {
    fontSize: 13,
    fontWeight: '500',
    fontFamily,
    lineHeight: 18,
  } as TextStyle,
  button: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily,
    lineHeight: 20,
  } as TextStyle,
} as const;
