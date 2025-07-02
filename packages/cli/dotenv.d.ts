declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      PORT: string;
      USER: string;
      HOST: string;
      PASSWORD: string;
    }
  }
}

export {};
