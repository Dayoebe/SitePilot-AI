import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  auth,
  loginWithGoogle,
  logoutUser,
  onAuthStateChanged,
  FirebaseUser,
} from '../services/firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  enterDemoMode: () => void;
  isDemoUser: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isDemoUser, setIsDemoUser] = useState<boolean>(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setIsDemoUser(false);
        setProfile({
          id: firebaseUser.uid,
          email: firebaseUser.email || 'user@sitepilot.ai',
          displayName: firebaseUser.displayName || 'SitePilot Analyst',
          photoURL: firebaseUser.photoURL || undefined,
          activeWorkspaceId: 'ws_default_' + firebaseUser.uid.substring(0, 8),
          createdAt: new Date().toISOString(),
        });
      } else if (!isDemoUser) {
        setUser(null);
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [isDemoUser]);

  const handleSignInGoogle = async () => {
    try {
      setIsLoading(true);
      await loginWithGoogle();
    } catch (err: any) {
      console.warn('Google sign-in popup notice or dismiss:', err?.message);
      // If popup was blocked or closed, give user option to explore as demo analyst
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await logoutUser();
      setUser(null);
      setIsDemoUser(false);
      setProfile(null);
    } catch (err: any) {
      console.error('Sign-out error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const enterDemoMode = () => {
    setIsDemoUser(true);
    setProfile({
      id: 'usr_demo_agency_lead',
      email: 'alex.consultant@sitepilot.ai',
      displayName: 'Alex Morgan',
      photoURL: '/src/assets/images/avatar_consultant_1792386655271.jpg',
      activeWorkspaceId: 'ws_apex_digital',
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        signInWithGoogle: handleSignInGoogle,
        signOut: handleSignOut,
        enterDemoMode,
        isDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
