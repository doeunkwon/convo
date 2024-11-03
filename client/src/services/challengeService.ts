import { today } from "../constants";
import { Challenge } from "../models/challenge";
import { getAuth } from "firebase/auth";

const baseUrl = process.env.REACT_APP_BASE_URL

// Creates a new challenge for today and saves it to the database (called directly when user signs up)
export async function createChallengeForToday(userID: string, setDailyChallenge: (challenge: Challenge) => void): Promise<void> {
  const currentDate = today.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const newChallenge = await generateChallenge(userID);
  if (newChallenge) {
    newChallenge.dateCreated = currentDate;
    setDailyChallenge(newChallenge);
    await saveChallengeToServer(userID, {
      ...newChallenge,
    });
  }
}

// Sets the daily challenge for the user (only called when user logs in)
export async function setupChallenge(userID: string, setDailyChallenge: (challenge: Challenge) => void): Promise<void> {
  const currentDate = today.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const existingChallenge = await getUserChallenge(userID);
  if (
    existingChallenge &&
    existingChallenge.dateCreated === currentDate // Indicates same day
  ) {
    setDailyChallenge(existingChallenge);
  } else {
    if (existingChallenge) {
      await deleteChallenge(userID);
    }
    await createChallengeForToday(userID, setDailyChallenge);
  }
}

// API call to generate a new challenge
export async function generateChallenge(userID: string): Promise<Challenge | null> {
  console.log('Generating challenge')
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    const response = await fetch(`${baseUrl}/generate-challenge?userID=${userID}`, {
      method: "POST", // Changed method to POST
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    if (response.ok) {
      const challenge = await response.json();
      console.log(challenge);
      return challenge;
    } else {
      console.error("Failed to fetch challenge");
    }
  } else {
    console.error("No user is signed in");
  }
  return null;
}

// API call to save a new challenge to the database
export async function saveChallengeToServer(
  userID: string,
  challenge: Challenge
): Promise<void> {
  console.log("Saving challenge to database");
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    const response = await fetch(`${baseUrl}/save-challenge`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ userID, ...challenge }),
    });

    if (!response.ok) {
      console.error("Failed to save challenge to server");
    }
  } else {
    console.error("No user is signed in");
  }
}

// API call to get the user's daily challenge
export async function getUserChallenge(userID: string): Promise<Challenge | null> {
  console.log("Fetching user challenge");
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    const response = await fetch(`${baseUrl}/get-challenge?userID=${userID}`, {
      headers: {
        Authorization: token,
      },
    });
    if (response.ok) {
      return await response.json();
    }
    console.error("Failed to fetch user challenge");
  } else {
    console.error("No user is signed in");
  }
  return null;
}

// API call to delete the user's daily challenge
export async function deleteChallenge(userID: string): Promise<void> {
  console.log("Deleting user challenge");
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    const response = await fetch(`${baseUrl}/delete-challenge?userID=${userID}`, {
      method: "DELETE",
      headers: {
        Authorization: token,
      },
    });
    if (!response.ok) {
      console.error("Failed to delete challenge");
    }
  } else {
    console.error("No user is signed in");
  }
}