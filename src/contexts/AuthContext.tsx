import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile as updateFirebaseProfile,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword as updateFirebasePassword,
  User as FirebaseUser
} from "firebase/auth";
import { doc, setDoc, getDoc, Firestore } from "firebase/firestore";
import { auth, firestore as firestoreInstance, googleProvider } from '@/configs/firebase';
import { recordActivity } from '@/hooks/use-toast';


// --- Interfaces ---
interface User {
  id: string; 
  email: string | null;
  firstName: string;
  lastName: string;
  profileImage?: string;
  therapistNumber?: string;
  
}

interface AuthContextType {
  currentUser: User | null; 
  isAuthenticated: boolean;
  isLoading: boolean; 
  login: (email: string, password: string) => Promise<void>;
  signup: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>; 
  resetPassword: (email: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  updateProfile: (userData: Partial<Pick<User, 'firstName' | 'lastName' | 'profileImage'>>) => Promise<void>;
}

// --- Context ---
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// --- Provider ---
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); 
  const [isOperating, setIsOperating] = useState(false); 
  const navigate = useNavigate();

  // --- Firestore Helper ---
  const getUserProfile = async (firebaseUser: FirebaseUser): Promise<User | null> => {
    const userRef = doc(firestoreInstance, "users", firebaseUser.uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const data = userSnap.data();
      return {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        profileImage: data.profileImage || firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`,
        therapistNumber: data.therapistNumber,
        
      };
    } else {
       const basicProfile: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        firstName: firebaseUser.displayName?.split(' ')[0] || 'User',
        lastName: firebaseUser.displayName?.split(' ')[1] || '',
        profileImage: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`,
        
      };
      await setDoc(userRef, basicProfile, { merge: true });
             return basicProfile;
    }
  };

  const createUserProfile = async (firebaseUser: FirebaseUser, firstName: string, lastName: string) => {
    const userRef = doc(firestoreInstance, "users", firebaseUser.uid);
    await setDoc(userRef, {
      firstName,
      lastName,
      email: firebaseUser.email, 
      createdAt: new Date(), 
      profileImage: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}` 
    }, { merge: true });
  };

  // --- Auth State Listener ---
  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (firebaseCurrentUser) => {
      if (firebaseCurrentUser) {
        try {
          const userProfile = await getUserProfile(firebaseCurrentUser);
           if (userProfile) {
             setCurrentUser(userProfile);
           } else {
              
              setCurrentUser(null); 
              console.error("Failed to fetch or create user profile for:", firebaseCurrentUser.uid);
              
            }
          } catch (error) {
          console.error("Error fetching user profile:", error);
          setCurrentUser(null); 
        }

      } else {
        setCurrentUser(null);   
       }
      setIsLoading(false); 
    });

    
    return () => unsubscribe();
   }, []); 

  // --- Auth Functions ---
  const login = async (email: string, password: string) => {
    setIsOperating(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userProfile = await getUserProfile(userCredential.user); 
       if (userProfile) {
         setCurrentUser(userProfile);
         toast.success('Login successful', {
           description: `Welcome back, ${userProfile.firstName || 'User'}!`,
         });
         recordActivity('login', 'Logged in', 'LoginPage');
         navigate('/');
       } else {
          
         toast.error('Login succeeded but failed to load profile.');
         
       }
    } catch (error: any) {
      console.error("Login Error:", error);
      toast.error('Login failed', {
        description: error.message || 'Please check your credentials and try again.',
      });
       setCurrentUser(null); 
    } finally {
      setIsOperating(false);
    }
  };

  const signup = async (firstName: string, lastName: string, email: string, password: string) => {
    setIsOperating(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      
       await updateFirebaseProfile(firebaseUser, { displayName: `${firstName} ${lastName}` });


      // Create user profile in Firestore
      await createUserProfile(firebaseUser, firstName, lastName);

      // Fetch the newly created full profile to update state
      const userProfile = await getUserProfile(firebaseUser);
      if (userProfile) {
        setCurrentUser(userProfile);
        toast.success('Signup successful', {
          description: `Welcome, ${userProfile.firstName || 'User'}!`,
        });
        recordActivity('signup', 'Created account', 'SignupPage');
        navigate('/login', { state: { email: email, signupSuccess: true } }); // Redirect after successful signup
      } else {
         toast.error('Signup succeeded but failed to create profile.');
         
      }
    } catch (error: any) {
      console.error("Signup Error:", error);
      toast.error('Signup failed', {
        description: error.message || 'Could not create account. Please try again.',
      });
       setCurrentUser(null); 
    } finally {
      setIsOperating(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsOperating(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      const userRef = doc(firestoreInstance, "users", firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      let profileData: User;

      if (!userSnap.exists()) {
         
         const firstName = firebaseUser.displayName?.split(' ')[0] || 'User';
         const lastName = firebaseUser.displayName?.split(' ').slice(1).join(' ') || '';
         await createUserProfile(firebaseUser, firstName, lastName);
         profileData = {
             id: firebaseUser.uid,
             email: firebaseUser.email,
             firstName: firstName,
             lastName: lastName,
             profileImage: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`
         };
         toast.success('Account created with Google', {
             description: `Welcome, ${profileData.firstName}!`,
         });
         setCurrentUser(profileData);
         recordActivity('signup', 'Created account with Google', 'SignupPage');
      } else {

         const existingProfile = await getUserProfile(firebaseUser);
         if (!existingProfile) throw new Error("Failed to fetch existing profile after Google sign-in.");
         profileData = existingProfile;
         toast.success('Logged in with Google', {
             description: `Welcome back, ${profileData.firstName}!`,
         });
         setCurrentUser(profileData);
         recordActivity('login', 'Logged in with Google', 'LoginPage');
      }

      navigate('/');

    } catch (error: any) {
      console.error("Google Sign-in Error:", error);
       
      if (error.code !== 'auth/popup-closed-by-user') {
           toast.error('Google Sign-in failed', {
             description: error.message || 'Could not sign in with Google. Please try again.',
           });
      }
      setCurrentUser(null);
    } finally {
      setIsOperating(false);
    }
  };

  const logout = async () => {
    setIsOperating(true); 
    try {
      await signOut(auth);
      setCurrentUser(null);
      toast.info('Logged out successfully');
      navigate('/login'); 
    } catch (error: any) {
      console.error("Logout Error:", error);
      toast.error('Logout failed', {
        description: error.message || 'Could not log out. Please try again.',
      });
    } finally {
      setIsOperating(false);
    }
  };

  const resetPassword = async (email: string) => {
     setIsOperating(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent', {
        description: 'Please check your inbox (and spam folder) for instructions.',
      });
    } catch (error: any) {
      console.error("Password Reset Error:", error);
      toast.error('Password reset failed', {
        description: error.message || 'Could not send reset email. Please try again.',
      });
    } finally {
       setIsOperating(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser || !firebaseUser.email) {
      toast.error('Not logged in', { description: 'You must be logged in to change your password.' });
      return false;
    }
    setIsOperating(true);
    try {
      const credential = EmailAuthProvider.credential(firebaseUser.email, currentPassword);
      await reauthenticateWithCredential(firebaseUser, credential);
      await updateFirebasePassword(firebaseUser, newPassword);
      toast.success('Password changed successfully', {
        description: 'Your password has been updated.',
      });
      recordActivity('update', 'Changed Password', 'ProfilePage');
      return true;
    } catch (error: any) {
      console.error('Password Change Error:', error);
      let description = error.message || 'Could not change password. Please try again.';
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        description = 'Your current password is incorrect.';
      }
      toast.error('Password change failed', { description });
      return false;
    } finally {
      setIsOperating(false);
    }
  };

  const updateProfile = async (userData: Partial<Pick<User, 'firstName' | 'lastName' | 'profileImage'>>) => {
     if (!currentUser) { 
       toast.error("Not logged in", { description: "You must be logged in to update your profile." });
       return;
     }
     setIsOperating(true);
     try {
       const userRef = doc(firestoreInstance, "users", currentUser.id); 
       await setDoc(userRef, userData, { merge: true }); 

       
       const currentFirebaseUser = auth.currentUser;
       if (currentFirebaseUser && (userData.firstName || userData.lastName)) {
           const displayName = `${userData.firstName || currentUser.firstName} ${userData.lastName || currentUser.lastName}`.trim();
             await updateFirebaseProfile(currentFirebaseUser, { displayName });
         }
        


       
       const updatedUser = { ...currentUser, ...userData }; 
       setCurrentUser(updatedUser);

       toast.success('Profile updated successfully');
     } catch (error: any) {
       console.error("Profile Update Error:", error);
       toast.error('Profile update failed', {
         description: error.message || 'Could not update profile. Please try again.',
       });
     } finally {
        setIsOperating(false);
     }
  };

  // --- Context Value ---
  const value = {
    currentUser,
    isAuthenticated: !!currentUser, 
    isLoading: isLoading || isOperating, 
    login,
    signup,
    loginWithGoogle,
    logout,
    resetPassword,
    changePassword,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
       {children}
    </AuthContext.Provider>
  );
};
