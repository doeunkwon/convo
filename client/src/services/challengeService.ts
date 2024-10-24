import { Challenge } from "../models/challenge";
import { getAuth } from "firebase/auth";

export async function fetchChallenge(): Promise<Challenge | null> {
  console.log('Fetching challenge')
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    const response = await fetch("http://localhost:8080/generate-challenge", {
      method: "POST",
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

export async function saveChallengeToServer(
  userID: string,
  challenge: Challenge
): Promise<void> {
  console.log("Saving challenge to database");
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    const response = await fetch("http://localhost:8080/save-challenge", {
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

export async function getUserChallenge(userID: string): Promise<Challenge | null> {
  console.log("Fetching user challenge");
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    const response = await fetch(`http://localhost:8080/get-challenge?userID=${userID}`, {
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

export async function deleteChallenge(userID: string): Promise<void> {
  console.log("Deleting user challenge");
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    const response = await fetch(`http://localhost:8080/delete-challenge?userID=${userID}`, {
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

  // function fetchChallenge() {
  //   setDailyChallenge({
  //     title: "The Compliment Game",
  //     task: "Give genuine compliments to three different people.",
  //     tip: "When giving compliments, try to make them specific and heartfelt. Instead of generic praise, focus on details like someone’s recent accomplishment, a unique trait, or how they made a positive impact. For example, instead of saying ‘You’re great,’ say ‘I really appreciate how organized you are; it made everything run smoothly today.’ This makes the compliment more meaningful and memorable, helping to build stronger connections.",
  //   });
  // }