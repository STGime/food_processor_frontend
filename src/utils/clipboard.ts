import * as Clipboard from 'expo-clipboard';

export async function copyToClipboard(text: string): Promise<void> {
  await Clipboard.setStringAsync(text);
}

export async function readFromClipboard(): Promise<string> {
  return Clipboard.getStringAsync();
}
