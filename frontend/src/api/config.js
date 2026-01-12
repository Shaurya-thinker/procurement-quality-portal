// Helper function to get user role from localStorage or context
export const getUserRole = () => {
  // This should be implemented based on your auth system
  return localStorage.getItem("userRole") || "user";
};