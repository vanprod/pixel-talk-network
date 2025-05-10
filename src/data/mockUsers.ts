
// Default users (for demo purposes)
export const MOCK_USERS = [
  {
    id: '1',
    email: 'user@example.com',
    password: 'password123',
    displayName: 'PixelUser',
    lastLogin: new Date().toISOString(),
    isOnline: false,
    friends: ['2']
  },
  {
    id: '2',
    email: 'demo@example.com',
    password: 'demo123',
    displayName: 'CryptoFan',
    lastLogin: new Date().toISOString(),
    isOnline: false,
    friends: ['1']
  }
];
