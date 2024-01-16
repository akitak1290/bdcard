"use client"
import { ChangeEvent, useEffect, useState } from "react";
import { useSignInWithEmailAndPassword, useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/_firebase/config";
import Link from 'next/link'

export function SignInDialog({ disableSignUp }: { disableSignUp: boolean }) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [promptError, setPromptError] = useState('');

	const [user, loadingUser, errorUser] = useAuthState(auth);
	const [signInWithEmailAndPassword, loggedInUser, loading, errorLogIn] = useSignInWithEmailAndPassword(auth);

	useEffect(() => {
		if (errorLogIn) {
			setPromptError(errorLogIn.code.split('/')[1])
		}
	}, [errorLogIn])

	const handleSignIn = async () => {
		try {
			await signInWithEmailAndPassword(email, password);
			setEmail('');
			setPassword('');
		} catch (e) { }
	}

	const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value)
		if (promptError !== '') setPromptError('')
	}

	const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value)
		if (promptError !== '') setPromptError('')
	}

	return (
		<div className="bg-white p-8 rounded shadow-md w-full max-w-md">
			{(promptError !== '') && <p className='text-b text-amber-700 text-center'>
				{promptError}
			</p>}
			<p className="text-2xl font-bold mb-6">Sign In</p>
			<input
				type="email"
				placeholder="Email"
				value={email}
				onChange={handleEmailChange}
				className="mb-4 w-full border p-2 rounded"
				required
			/>
			<input
				type="password"
				placeholder="Password"
				value={password}
				onChange={handlePasswordChange}
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
