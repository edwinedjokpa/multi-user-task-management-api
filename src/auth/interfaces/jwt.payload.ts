export interface JwtPayload {
  email: string;
  userId: string;
  type: 'user' | 'admin';
}
