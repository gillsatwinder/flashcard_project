import { jwtDecode } from 'jwt-decode';

//  DECODE THE USER INFO FROM TOKEN IN LOCAL STORAGE
export const getUserFromToken = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }
    
    const decoded = jwtDecode(token);
    return {
      userID: decoded.userID,
      email: decoded.email,
      username: decoded.username
    };
  } catch (error) {
    console.error('Error decoding token:', error);
    // If token is invalid, remove it
    localStorage.removeItem('token');
    return null;
  }
};

export const getUserID = () => {
  const user = getUserFromToken();
  return user ? user.userID : null;
};

// user name
export const getUsername = () => {
  const user = getUserFromToken();
  return user ? user.username : null;
};

export const isLoggedIn = () => {
  return getUserFromToken() !== null;
};