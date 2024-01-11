"use client"
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";

import { auth } from "@/app/_firebase/config"

export default function Home() {

	const handleSignOut = () => {
		signOut(auth)
		console.log('signed out user')
	}

	return (
		<>
			<button onClick={handleSignOut}>
				sign out
			</button>
		</>
	)
}