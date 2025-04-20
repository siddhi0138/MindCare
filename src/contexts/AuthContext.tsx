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
  User as FirebaseUser // Rename to avoid conflict with local User interface
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db, googleProvider } from '@/configs/firebase';
// const appleProvider = new OAuthProvider('apple.com'); // Example for Apple

// --- Interfaces ---
interface User {
  id: string; // Firebase UID
  email: string | null;
  firstName: string;
  lastName: string;
  profileImage?: string;
  // Add any other custom fields you store in Firestore
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean; // Tracks initial auth check and ongoing operations
  login: (email: string, password: string) => Promise<void>;
  signup: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  // loginWithApple: () => Promise<void>; // Add Apple login if needed
  logout: () => Promise<void>; // Make logout async
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (userData: Partial<Pick<User, 'firstName' | 'lastName' | 'profileImage'>>) => Promise<void>; // Make update async
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // True initially while checking auth state
  const [isOperating, setIsOperating] = useState(false); // For specific operations like login/signup
  const navigate = useNavigate();

  // --- Firestore Helper ---
  const getUserProfile = async (firebaseUser: FirebaseUser): Promise<User | null> => {
    const userRef = doc(db, "users", firebaseUser.uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const data = userSnap.data();
      return {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        profileImage: data.profileImage || firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`, // Fallback profile image
        // Add other fields if needed
      };
    } else {
      // Create a basic profile from available Firebase Auth info
       const basicProfile: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        firstName: firebaseUser.displayName?.split(' ')[0] || 'User',
        lastName: firebaseUser.displayName?.split(' ')[1] || '',
        profileImage: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`
      };
      await setDoc(userRef, basicProfile, { merge: true });
             return basicProfile;
    }
  };

  const createUserProfile = async (firebaseUser: FirebaseUser, firstName: string, lastName: string) => {
    const userRef = doc(db, "users", firebaseUser.uid);
    await setDoc(userRef, {
      firstName,
      lastName,
      email: firebaseUser.email, // Store email in Firestore as well if needed
      createdAt: new Date(), // Optional: track creation date
      profileImage: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}` // Initial profile image
    }, { merge: true }); // Use merge: true to avoid overwriting if doc exists unexpectedly
  };

  // --- Auth State Listener ---
  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userProfile = await getUserProfile(firebaseUser);
           if (userProfile) {
             setUser(userProfile);
           } else {
             // If getUserProfile returns null (e.g., Firestore error or profile doesn't exist and wasn't auto-created)
             setUser(null); // Or handle as an error state
             console.error("Failed to fetch or create user profile for:", firebaseUser.uid);
             // Optionally sign out the user if a profile is mandatory
             // await signOut(auth);
           }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUser(null); // Set user to null on error
          // Optionally sign out the user
          // await signOut(auth);
        }

      } else {
        setUser(null);
      }
      setIsLoading(false); // Finished initial auth check
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []); // Run only once on mount

  // --- Auth Functions ---
  const login = async (email: string, password: string) => {
    setIsOperating(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userProfile = await getUserProfile(userCredential.user); // Fetch profile after login
       if (userProfile) {
         setUser(userProfile); // Update local state immediately
         toast.success('Login successful', {
           description: `Welcome back, ${userProfile.firstName || 'User'}!`,
         });
         navigate('/'); // Redirect after successful login
       } else {
          // Handle case where login succeeds but profile fetch fails
         toast.error('Login succeeded but failed to load profile.');
         // Sign out potentially?
         // await signOut(auth);
       }
    } catch (error: any) {
      console.error("Login Error:", error);
      toast.error('Login failed', {
        description: error.message || 'Please check your credentials and try again.',
      });
       setUser(null); // Ensure user state is null on failed login
    } finally {
      setIsOperating(false);
    }
  };

  const signup = async (firstName: string, lastName: string, email: string, password: string) => {
    setIsOperating(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Optionally update Firebase Auth profile (displayName)
       await updateFirebaseProfile(firebaseUser, { displayName: `${firstName} ${lastName}` });


      // Create user profile in Firestore
      await createUserProfile(firebaseUser, firstName, lastName);

      // Fetch the newly created full profile to update state
      const userProfile = await getUserProfile(firebaseUser);
      if (userProfile) {
        setUser(userProfile); // Update local state immediately
        toast.success('Signup successful', {
          description: `Welcome, ${userProfile.firstName || 'User'}!`,
        });
        navigate('/login', { state: { email: email, signupSuccess: true } }); // Redirect after successful signup
      } else {
         toast.error('Signup succeeded but failed to create profile.');
         // Potentially revert signup or handle differently
      }
    } catch (error: any) {
      console.error("Signup Error:", error);
      toast.error('Signup failed', {
        description: error.message || 'Could not create account. Please try again.',
      });
       setUser(null); // Ensure user state is null on failed signup
    } finally {
      setIsOperating(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsOperating(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      const userRef = doc(db, "users", firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      let profileData: User;

      if (!userSnap.exists()) {
         // User is new, create profile in Firestore
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
      } else {
         // User exists, fetch their profile
         const existingProfile = await getUserProfile(firebaseUser);
         if (!existingProfile) throw new Error("Failed to fetch existing profile after Google sign-in.");
         profileData = existingProfile;
         toast.success('Logged in with Google', {
             description: `Welcome back, ${profileData.firstName}!`,
         });
      }


      setUser(profileData); // Update local state immediately
      navigate('/'); // Redirect after successful login/signup

    } catch (error: any) {
      console.error("Google Sign-in Error:", error);
       // Handle specific errors like popup closed by user
      if (error.code !== 'auth/popup-closed-by-user') {
           toast.error('Google Sign-in failed', {
             description: error.message || 'Could not sign in with Google. Please try again.',
           });
      }
       setUser(null);
    } finally {
      setIsOperating(false);
    }
  };

  const logout = async () => {
    setIsOperating(true); // Use isOperating for consistency, though logout is usually fast
    try {
      await signOut(auth);
      setUser(null);
      toast.info('Logged out successfully');
      navigate('/login'); // Redirect to login page after logout
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

  const updateProfile = async (userData: Partial<Pick<User, 'firstName' | 'lastName' | 'profileImage'>>) => {
     if (!user) {
       toast.error("Not logged in", { description: "You must be logged in to update your profile." });
       return;
     }
     setIsOperating(true);
     try {
       const userRef = doc(db, "users", user.id);
       await setDoc(userRef, userData, { merge: true }); // Update Firestore

       // Optionally update Firebase Auth profile if name changed
        const currentFirebaseUser = auth.currentUser;
        if (currentFirebaseUser && (userData.firstName || userData.lastName)) {
            const displayName = `${userData.firstName || user.firstName} ${userData.lastName || user.lastName}`.trim();
            await updateFirebaseProfile(currentFirebaseUser, { displayName });
        }
        // Optionally update photoURL in Firebase Auth profile if profileImage changed
        // if (currentFirebaseUser && userData.profileImage) {
        //    await updateFirebaseProfile(currentFirebaseUser, { photoURL: userData.profileImage });
        // }


       // Update local state optimistically or re-fetch
       const updatedUser = { ...user, ...userData };
       setUser(updatedUser);

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
    user,
    isAuthenticated: !!user, // True if user object is not null
    isLoading: isLoading || isOperating, // Combine initial loading and operation loading
    login,
    signup,
    loginWithGoogle,
    // loginWithApple, // Add Apple login if needed
    logout,
    resetPassword,
    updateProfile,
  };

  // Render children only after initial auth check is complete
  return (
    <AuthContext.Provider value={value}>
       {children}
    </AuthContext.Provider>
  );
};
