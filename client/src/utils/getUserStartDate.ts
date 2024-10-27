import { getAuth } from "firebase/auth";

export function getUserCreationTime(): string {
    const auth = getAuth()
    const user = auth.currentUser
    if (user && user.metadata.creationTime) {
        return user.metadata.creationTime
    } else {
        return ""
    }
}