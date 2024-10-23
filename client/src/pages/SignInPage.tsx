import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User signed in:", userCredential.user);
      navigate("/daily"); // Redirect to /daily after successful sign-in
    } catch (error: any) {
      console.error("Error signing in:", error.message);
    }
  };

  return (
    <div>
      <h1>Sign in</h1>
      <form onSubmit={handleSignIn}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Sign In</button>
      </form>
      <button onClick={() => navigate("/signup")}>Create an Account</button>
    </div>
  );
}

export default SignInPage;

// import { signOut } from "firebase/auth";
// import { auth } from "../firebaseConfig";

// function handleSignOut() {
//   signOut(auth)
//     .then(() => {
//       console.log("User signed out");
//     })
//     .catch((error) => {
//       console.error("Error signing out:", error.message);
//     });
// }
