import 'fast-text-encoding';
import 'react-native-get-random-values';
import { btoa, atob } from 'react-native-quick-base64';
import { Buffer } from 'buffer';
if (!global.btoa) {
  global.btoa = btoa;
}
if (!global.atob) {
  global.atob = atob;
}
if (!global.Buffer) {
  global.Buffer = Buffer;
}
