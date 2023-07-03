export const checkPasswordSecurity = (password: string) => {
  const passwordRegex = new RegExp(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
  );
  const valid = passwordRegex.test(password);
  if (valid)
    return {
      valid,
    };
  return {
    valid,
    error:
      'Password must contain at least one lowercase letter, one uppercase letter, one number and one special character',
  };
};
