"use client"
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/_firebase/config";
import { useRouter } from "next/navigation";
import Spinner from "@/app/_extraComponents/spinner";

import { SignInDialog } from "./signInDialog";

export default function SignIn() {
	const router = useRouter()

	const [user, loading, error] = useAuthState(auth);

	useEffect(() => {
		if (!loading && user) router.push('/');
	}, [user, loading, error, router])

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			{
				(!loading && !user) ?
					<SignInDialog disableSignUp={false} />
					: <Spinner />
			}
		</div>
	)
}