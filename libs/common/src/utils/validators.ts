export const validateEmail = (email: string) => {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

export const validateName = (name: string) => {
  const re = /^[a-zA-Z ]{2,30}$/;
  return re.test(name);
};
