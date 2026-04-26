import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for active session on load
    const activeSession = localStorage.getItem('activeUser');
    if (activeSession) {
      setUser(JSON.parse(activeSession));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const foundUser = users.find(u => u.email === email && u.password === password);
        
        if (foundUser) {
          const sessionUser = { id: foundUser.id, name: foundUser.name, email: foundUser.email };
          localStorage.setItem('activeUser', JSON.stringify(sessionUser));
          setUser(sessionUser);
          resolve(sessionUser);
        } else {
          reject('Invalid email or password');
        }
      }, 500); // Simulate network delay
    });
  };

  const register = (name, email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.find(u => u.email === email)) {
          return reject('User with this email already exists');
        }
        
        const newUser = { id: Date.now().toString(), name, email, password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        const sessionUser = { id: newUser.id, name: newUser.name, email: newUser.email };
        localStorage.setItem('activeUser', JSON.stringify(sessionUser));
        setUser(sessionUser);
        resolve(sessionUser);
      }, 500); // Simulate network delay
    });
  };

  const logout = () => {
    localStorage.removeItem('activeUser');
    setUser(null);
  };

  if (loading) {
    return <div className="h-screen w-screen flex items-center justify-center bg-[#0a0a0a] text-white">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
