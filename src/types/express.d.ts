import 'express';

declare module 'express' {
  interface Request {
    cookies: Record<string, any>;
    user?: {
      id: string;
      role: string;
      email: string;
      iat?: number;
      exp?: number;
    };
  }
}
