import { useContext, createContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut as authSignOut } from 'firebase/auth';
import { auth } from './firebase';

const AuthUserContext = createContext({
  authUser: null,
  isLoading: true,
});

export default function useFirebaseAuth() {
  const [authUser, setAuthUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const cleanupAuthUser = () => {
    setAuthUser(null);
    setIsLoading(false);
  };
  const authStateChanged = async (user) => {
    setIsLoading(true);
    if (!user) {
      cleanupAuthUser();
      return;
    }
    setAuthUser({
      uid: user.uid,
      email: user.email,
      username: user.displayName,
    });
    setIsLoading(false);
  };

  //signout
  const signOut = () => {
    authSignOut(auth).then(() => cleanupAuthUser());
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, authStateChanged);
    return () => unsubscribe();
  }, []);

  return {
    authUser,
    setAuthUser,
    isLoading,
    signOut,
  };
}

export const AuthUserProvider = ({ children }) => {
  const auth = useFirebaseAuth();
  return (
    <AuthUserContext.Provider value={auth}>{children}</AuthUserContext.Provider>
  );
};

export const userAuth = () => useContext(AuthUserContext);
