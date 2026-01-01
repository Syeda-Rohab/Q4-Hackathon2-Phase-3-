export const saveToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    // Save to both localStorage and cookie
    localStorage.setItem('access_token', token);
    document.cookie = `access_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days
  }
};

export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

export const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};
