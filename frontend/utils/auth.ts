import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebaseConfig"; // Ensure this is correctly imported

// ✅ Function to Sign Up a New User
export const signup = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user };
  } catch (error: any) {
    console.error("Signup Error:", error.message);
    return { error: error.message }; // ✅ Ensure errors are properly returned
  }
};


// ✅ Function to Log In an Existing User
export const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user };
  } catch (error) {
    return { error: error.message };
  }
};

// ✅ Function to Log Out
export const logout = async () => {
  try {
    await signOut(auth);
    return { message: "Logged out successfully" };
  } catch (error) {
    return { error: error.message };
  }
};

// ✅ Ensure all functions are properly exported
export { signup, login, logout };
