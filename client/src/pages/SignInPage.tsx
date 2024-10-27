import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import "../styles/SignInPage.css"; // Import the CSS file for styling
import convo from "../assets/convo.png";

function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Add state for error message
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(""); // Reset error message before sign in attempt
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User signed in:", userCredential.user);
      navigate("/daily");
    } catch (error: any) {
      console.error("Error signing in:", error.message);
      setErrorMessage("Invalid email or password. Please try again."); // Set error message
    }
  };

  // const handleGoogleSignIn = async () => {
  //   const provider = new GoogleAuthProvider();
  //   try {
  //     const result = await signInWithPopup(auth, provider);
  //     console.log("Google sign-in successful:", result.user);
  //     navigate("/daily"); // Redirect to /daily after successful Google sign-in
  //   } catch (error: any) {
  //     console.error("Error signing in with Google:", error.message);
  //   }
  // };

  return (
    <main className="sign-in">
      <section className="sign-in-content">
        <section className="sign-in-header">
          <img src={convo} alt="Convo Logo" />
          <p>Become more social with Convo.</p>
        </section>
        {/* <button onClick={handleGoogleSignIn} className="sign-in-google-button">
          <p style={{ color: "var(--text-color)" }}>
            <i className="ri-google-fill"></i>
          </p>
          <p style={{ color: "var(--text-color)" }}>Log in with Google</p>
        </button>
        <div
          style={{
            width: "100%",
            height: "2px",
            background: "var(--feint-color)",
          }}
        /> */}
        <form onSubmit={handleSignIn} className="sign-in-form">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="sign-in-input-field"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="sign-in-input-field"
          />
          <button type="submit" className="sign-in-button">
            <p style={{ color: "var(--white-color)" }}>Log in</p>
          </button>
        </form>
        <section onClick={() => navigate("/signup")}>
          <p className="sign-in-create-account-button">Or create an account</p>
        </section>
      </section>
      {errorMessage && <p className="sign-in-error">{errorMessage}</p>}
    </main>
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
