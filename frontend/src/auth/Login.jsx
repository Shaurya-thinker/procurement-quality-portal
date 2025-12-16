export const getRole = () => {
  return localStorage.getItem("role");
};

export const setRole = (role) => {
  localStorage.setItem("role", role);
};

export const logout = () => {
  localStorage.clear();
};
