import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'cpkku.sujira.lab07',
  appName: 'lab07-authen',
  webDir: 'dist',
  plugins: {
    FirebaseAuthentication: {
      providers: ['google.com']
    }
  }
};

export default config;