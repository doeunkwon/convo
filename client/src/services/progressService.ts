import { daysPerWeek, weeks } from "../constants";
import { Progress } from "../models/progress";
import { getAuth } from "firebase/auth";

export async function setupProgress(userID: string, setProgress: (progress: Progress) => void): Promise<void> {
    const existingProgress = await getUserProgress(userID);
    if ( existingProgress ) {
      setProgress(existingProgress);
    } else {
        const newProgress = {
            currentStreak: 0,
            longestStreak: 0,
            history: Array.from(
                { length: weeks * daysPerWeek },
                () => false
            ),
        };
        setProgress(newProgress);
        await saveProgressToServer(userID, {
          ...newProgress,
        });
    }
  }

export async function saveProgressToServer(
  userID: string,
  progress: Progress
): Promise<void> {
  console.log("Saving progress to database");
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    const response = await fetch("http://localhost:8080/save-progress", {
      method: "POST",   
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ userID, ...progress }),
    });

    if (!response.ok) {
      console.error("Failed to save progress to server");
    }
  } else {
    console.error("No user is signed in");
  }
}

export async function getUserProgress(userID: string): Promise<Progress | null> {
  console.log("Fetching user progress");
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    const response = await fetch(`http://localhost:8080/get-progress?userID=${userID}`, {
      headers: {
        Authorization: token,
      },
    });
    if (response.ok) {
      return await response.json();
    }
    console.error("Failed to fetch user progress");
  } else {
    console.error("No user is signed in");
  }
  return null;
}

export async function deleteProgress(userID: string): Promise<void> {
  console.log("Deleting user progress");
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    const response = await fetch(`http://localhost:8080/delete-progress?userID=${userID}`, {
      method: "DELETE",
      headers: {
        Authorization: token,
      },
    });
    if (!response.ok) {
        console.error("Failed to delete progress");
    }
  } else {
    console.error("No user is signed in");
  }
}