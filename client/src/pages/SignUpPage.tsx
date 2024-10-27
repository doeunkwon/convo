import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import "../styles/SignUpPage.css";
import convo from "../assets/convo.png";

function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isStrongPassword(password)) {
      setErrorMessage(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
      );
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User registered:", userCredential.user);
      setErrorMessage("");
      navigate("/daily"); // Redirect to /daily after successful sign-up
    } catch (error: any) {
      console.error("Error signing up:", error.message);
      setErrorMessage(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Google sign-in successful:", result.user);
      navigate("/daily"); // Redirect to /daily after successful Google sign-in
    } catch (error: any) {
      console.error("Error signing in with Google:", error.message);
    }
  };

  const isStrongPassword = (password: string) => {
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  };

  return (
    <main className="sign-up">
      <section className="sign-up-content">
        <img
          style={{
            height: "calc(12px + 1vmin)",
            marginBottom: "var(--small-gap)",
          }}
          src={convo}
          alt="Convo Logo"
        />
        <button onClick={handleGoogleSignIn} className="sign-up-google-button">
          <p style={{ color: "var(--text-color)" }}>
            <i className="ri-google-fill"></i>
          </p>
          <p style={{ color: "var(--text-color)" }}>Sign up with Google</p>
        </button>
        <div
          style={{
            width: "100%",
            height: "2px",
            background: "var(--feint-color)",
          }}
        />
        <form onSubmit={handleSignUp} className="sign-up-form">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="sign-up-input-field"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="sign-up-input-field"
          />
          <button type="submit" className="sign-up-button">
            <p style={{ color: "var(--white-color)" }}>Sign up</p>
          </button>
        </form>
      </section>
      {errorMessage && <p className="sign-up-error">{errorMessage}</p>}
    </main>
  );
}

export default SignUpPage;
