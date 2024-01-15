"use client"
import { useEffect, useState } from "react";
import { useSignInWithEmailAndPassword, useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/_firebase/config";
import { useRouter } from "next/navigation";
import Link from 'next/link'
import Spinner from "@/app/_extraComponents/spinner";

export function SignInDialog({ disableSignUp }: { disableSignUp?: boolean }) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const [user, loadingUser, errorUser] = useAuthState(auth);
	const [signInWithEmailAndPassword, loggedInUser, loading, error] = useSignInWithEmailAndPassword(auth);

	const handleSignIn = async () => {
		try {
			await signInWithEmailAndPassword(email, password);
			console.log(user!.uid)
			// AddUserToDb(loggedInUser.user.uid);
			setEmail('');
			setPassword('');
		} catch (e) {
			console.log(e);
		}
	}

	return (
		<div className="bg-white p-8 rounded shadow-md w-full max-w-md">
			{(error) && <h2 className='text-b text-amber-700 text-center'>Something when wrong!, please try again later.</h2>}
			<h2 className="text-2xl font-bold mb-6">Sign In</h2>
			<input
				type="email"
				placeholder="Email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				className="mb-4 w-full border p-2 rounded"
				required
			/>
			<input
				type="password"
				placeholder="Password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				className="mb-4 w-full border p-2 rounded"
				required
			/>
			<button
				onClick={handleSignIn}
				className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
			>
				Sign In
			</button>
			{
				!disableSignUp &&
				<p className="mt-4 text-center w-full">or <Link href="/createAccount" className="text-amber-500">sign up</Link></p>
			}

		</div>
	)
}

export default function SignIn() {
	const router = useRouter()

	const [user, loading, error] = useAuthState(auth);

	useEffect(() => {
		console.log('woo')
		if (!loading && user) router.push('/');
	}, [user, loading, error])

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			{
				(!loading && !user) ?
					<SignInDialog />
					: <Spinner />
			}
		</div>
	)
}