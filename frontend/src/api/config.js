// API Configuration for different modules
export const API_CONFIG = {
  baseURL: process.env.NODE_ENV === 'production' 
    ? process.env.VITE_API_URL || "https://procurement-quality-portal-production.up.railway.app"
    : "http://localhost:8000",
  
  // Module-specific authentication requirements
  modules: {
    procurement: {
      authType: "bearer", // Uses Bearer token
      prefix: "/api/v1/procurement"
    },
    quality: {
      authType: "role", // Uses role-based auth
      prefix: "/api/v1/quality"
    },
    store: {
      authType: "role", // Uses role-based auth  
      prefix: "/api/v1/store"
    }
  },
  
  // Default headers for each auth type
  getHeaders: (authType, token, role = null) => {
    const headers = {
      "Content-Type": "application/json"
    };
    
    if (authType === "bearer" && token) {
      headers.Authorization = `Bearer ${token}`;
    } else if (authType === "role" && role) {
      // For role-based auth, you might need to send role in headers
      // Adjust this based on your backend implementation
      headers["X-User-Role"] = role;
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return headers;
  }
};

// Helper function to get user role from localStorage or context
export const getUserRole = () => {
  // This should be implemented based on your auth system
  return localStorage.getItem("userRole") || "user";
};