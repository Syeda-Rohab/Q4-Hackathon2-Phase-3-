export const validateTitle = (title: string): string | null => {
  const trimmed = title.trim();
  if (!trimmed) return "Title cannot be empty";
  if (trimmed.length > 200) return "Title exceeds 200 characters";
  return null;
};

export const validateDescription = (description: string): string | null => {
  if (description.length > 1000) return "Description exceeds 1000 characters";
  return null;
};

export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Invalid email format";
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (password.length < 8) return "Password must be at least 8 characters";
  return null;
};
