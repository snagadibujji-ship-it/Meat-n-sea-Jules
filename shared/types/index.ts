export interface User {
  id: string;
  email: string;
  role: 'customer' | 'vendor' | 'partner' | 'admin';
}
