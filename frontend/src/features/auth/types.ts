export type SignUpType = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type RegisterServiceType = {
  name: string;
  email: string;
  password: string;
  role: string;
};
export type LoginServiceType = {
  email: string;
  password: string;
};
