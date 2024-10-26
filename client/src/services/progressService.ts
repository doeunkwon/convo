import { daysPerWeek, weeks } from "../constants";
import { Progress } from "../models/progress";
import { getAuth, User } from "firebase/auth";
import { calculateDaysPassed } from "../utils/calculateDaysPassed";

export const toggleCompletion = (localProgress: Progress, setLocalProgress: (progress: Progress) => void, user: User) => {
  if (user.metadata.creationTime) {
    const todayIndex = calculateDaysPassed(user.metadata.creationTime);
    // Use deep copy (copying by value) to avoid mutating the state directly
    // This is necessary because React state updates are based on reference equality
    const updatedHistory = [...localProgress.history];
    updatedHistory[todayIndex] = !updatedHistory[todayIndex];
    const newProgress = { ...localProgress, history: updatedHistory }
    setLocalProgress(newProgress);
    updateProgress(user.uid, newProgress);
  }
};

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

export async function updateProgress(userID: string, progress: Progress): Promise<void> {
  console.log("Updating user progress");
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    const response = await fetch(`http://localhost:8080/update-progress?userID=${userID}`, {
      method: "PUT", // Use PUT for updates
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(progress),
    });

    if (!response.ok) {
      console.error("Failed to update progress");
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