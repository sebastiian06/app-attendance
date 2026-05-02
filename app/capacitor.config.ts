// app/capacitor.config.ts
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.app.attendance',
  appName: 'App Attendance',
  webDir: 'dist',
  server: {
    androidScheme: 'http',
    cleartext: true,
    hostname: 'localhost',
    iosScheme: 'http'
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true
  }
};

export default config;