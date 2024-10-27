import { daysPerWeek, today, weeks } from "../constants";
import { Progress } from "../models/progress";
import { getAuth, User } from "firebase/auth";
import { calculateDaysPassed } from "../utils/calculateDaysPassed";

const baseUrl = process.env.REACT_APP_BASE_URL

export const toggleCompletion = (localProgress: Progress, setLocalProgress: (progress: Progress) => void, user: User) => {
  if (user.metadata.creationTime) {
    const todayIndex = calculateDaysPassed(user.metadata.creationTime);
    // Use deep copy (copying by value) to avoid mutating the state directly
    // This is necessary because React state updates are based on reference equality
    const updatedHistory = [...localProgress.history];
    updatedHistory[todayIndex] = !updatedHistory[todayIndex];
    const newProgress = updateStreaks({ ...localProgress, history: updatedHistory}, todayIndex)
    setLocalProgress(newProgress);
    updateProgress(user.uid, newProgress);
  }
};

export async function setupProgress(user: User, setProgress: (progress: Progress) => void): Promise<void> {
    const existingProgress = await getUserProgress(user.uid);
    const currentDate = today.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    if ( existingProgress && user.metadata.creationTime ) {
      if (currentDate !== existingProgress.dateUpdated) {
        const todayIndex = calculateDaysPassed(user.metadata.creationTime)
        const newProgress = updateStreaks(existingProgress, todayIndex)
        updateProgress(user.uid, newProgress)
        setProgress(newProgress)
      } else {
        setProgress(existingProgress)
      }
    } else {
        const newProgress = {
            currentStreak: 0,
            longestStreak: 0,
            history: Array.from(
                { length: weeks * daysPerWeek },
                () => false
            ),
            dateUpdated: currentDate
        };
        setProgress(newProgress);
        await saveProgressToServer(user.uid, {
          ...newProgress,
        });
    }
  }

// Helper function to update current and longest streaks up to todayIndex
const updateStreaks = (progress: Progress, todayIndex: number): Progress => {
  let currentStreak = 0;
  let longestStreak = 0; // Initialize longestStreak to 0
  let consecutiveFalses = 0; // Track consecutive false days

  // Iterate only up to todayIndex
  for (let i = 0; i < todayIndex; i++) { // Change to < todayIndex
    if (progress.history[i]) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak); // Update longestStreak in real-time
      consecutiveFalses = 0; // Reset consecutive falses
    } else {
      consecutiveFalses++;
      if (consecutiveFalses >= 1) {
        currentStreak = 0; // Reset current streak if there are two consecutive false days
      }
    }
  }

  // If today is marked as true, increment the current streak
  if (todayIndex < progress.history.length && progress.history[todayIndex]) {
    currentStreak++; // Increment only if today is true
    longestStreak = Math.max(longestStreak, currentStreak); // Update longestStreak if today is true
  }

  return {
    ...progress,
    currentStreak,
    longestStreak, // Return the updated longestStreak
  };
};

export async function saveProgressToServer(
  userID: string,
  progress: Progress
): Promise<void> {
  console.log("Saving progress to database");
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    const response = await fetch(`${baseUrl}:8080/save-progress`, {
      method: "POST",   
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ userID, ...progress}),
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
  const currentDate = today.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
  if (user) {
    const token = await user.getIdToken();
    const response = await fetch(`${baseUrl}:8080/update-progress?userID=${userID}`, {
      method: "PUT", // Use PUT for updates
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({...progress, dateUpdated: currentDate}),
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
    const response = await fetch(`${baseUrl}:8080/get-progress?userID=${userID}`, {
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
    const response = await fetch(`${baseUrl}:8080/delete-progress?userID=${userID}`, {
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