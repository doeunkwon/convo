import { getAuth } from "firebase/auth";
import { Preference } from "../models/preference";

const baseUrl = process.env.REACT_APP_BASE_URL

export async function setupPreference(userID: string, setPreference: (preference: Preference) => void, level?: number): Promise<void> {
    const existingPreference = await getUserPreference(userID);
    if ( existingPreference ) {
        setPreference(existingPreference);
    } else {
      if (level) {
        const newPreference = { level: level }
        setPreference(newPreference);
        await saveUserPreference(userID, {
          ...newPreference,
        });
        console.log(newPreference)
      }
    }
  }

export async function getUserPreference(userID: string): Promise<Preference | null> {
    console.log("Fetching user preference");
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      const response = await fetch(`${baseUrl}/get-preference?userID=${userID}`, {
        headers: {
          Authorization: token,
        },
      });
      if (response.ok) {
        return await response.json();
      }
      console.error("Failed to fetch user preference");
    } else {
      console.error("No user is signed in");
    }
    return null;
  }
  
  export async function updateUserPreference(userID: string, preference: Preference): Promise<void> {
    console.log("Updating user preference");
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      const response = await fetch(`${baseUrl}/update-preference?userID=${userID}`, {
        method: "PUT", // Use PUT for updates
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(preference),
      });
  
      if (!response.ok) {
        console.error("Failed to update preference");
      }

      console.log(preference)
    } else {
      console.error("No user is signed in");
    }
  }
  
  export async function saveUserPreference(userID: string, preference: Preference): Promise<void> {
    console.log("Saving user preference");
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      const response = await fetch(`${baseUrl}/save-preference`, {
        method: "POST",   
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ userID, ...preference }),
      });
  
      if (!response.ok) {
        console.error("Failed to save preference to server");
      }
    } else {
      console.error("No user is signed in");
    }
  }
  
  export async function deleteUserPreference(userID: string): Promise<void> {
    console.log("Deleting user preference");
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      const response = await fetch(`${baseUrl}/delete-preference?userID=${userID}`, {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      });
      if (!response.ok) {
        console.error("Failed to delete preference");
      }
    } else {
      console.error("No user is signed in");
    }
  }