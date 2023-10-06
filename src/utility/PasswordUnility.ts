const bcrypt = require('bcrypt');

export const GenerateSalt = async () => {
  return await bcrypt.genSalt(10);
};

export const GeneratePassword = async (password?: string, salt?: string) => {
  return await bcrypt.hash(password as string, salt as string);
};

export const ValidatePassword = async (
  enteredPassword: string,

  savedPassword: string,
  salt: string,
) => {
  return (await GeneratePassword(enteredPassword, salt)) === savedPassword;
};
