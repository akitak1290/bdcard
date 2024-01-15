"use client"

import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";

import { auth } from "@/app/_firebase/config";
import Spinner from "@/app/_extraComponents/spinner";
import { CreateAccountDialog } from "./createAccountDialog";

export default function CreateAccount() {
	const [user, loadingAuth, errorAuth] = useAuthState(auth);
	const router = useRouter();

	useEffect(() => {
		if (!loadingAuth && user) router.push('/');
	}, [user, loadingAuth, errorAuth, router])

	return (
		<>
			<div className="min-h-screen flex items-center justify-center bg-gray-100">
				{
					(!loadingAuth && !user)
						?
						<CreateAccountDialog disableSignIn={false} />
						: <Spinner />
				}
			</div>
		</>
	)
}