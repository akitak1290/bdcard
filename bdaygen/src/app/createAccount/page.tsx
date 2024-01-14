"use client"

import { ChangeEvent, useEffect, useState } from "react";
import { useAuthState, useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/app/_firebase/config";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Spinner from "@/app/_extraComponents/spinner";

export function CreateAccountDialog({ disableSignIn }: { disableSignIn?: boolean }) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [promptError, setPromptError] = useState('');

	const [
		createUserWithEmailAndPassword,
		registeredUser,
		loading,
		error
	] = useCreateUserWithEmailAndPassword(auth);

	useEffect(() => {
		if (error) {
			console.log(error)
			console.log(error.code.split('/')[1])
			setPromptError(error.code.split('/')[1])
		}
	}, [error, loading])

	const handleSignUp = async () => {
		try {
			await createUserWithEmailAndPassword(email, password);
		} catch (e) {
			console.log(e);
		}

		setEmail('');
		setPassword('');
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
			<h2 className="text-2xl font-bold mb-6">Sign Up</h2>
			{
				(promptError)
					? <p className="w-full rounded bg-blue-300 mb-4">{promptError}</p>
					: <></>
			}
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
				onClick={handleSignUp}
				className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
			>
				Sign Up
			</button>
			<p className="mt-4 text-center w-full">
				Already have an account?
				<Link href="/signIn" className="text-amber-500"> sign in
				</Link></p>
		</div>
	)
}

export default function CreateAccount() {
	const [user, loadingAuth, errorAuth] = useAuthState(auth);
	const router = useRouter();

	useEffect(() => {
		if (!loadingAuth && user) router.push('/');
	}, [user, loadingAuth, errorAuth])

	return (
		<>
			<div className="min-h-screen flex items-center justify-center bg-gray-100">
				{
					(!loadingAuth && !user)
						?
						<CreateAccountDialog />
						: <Spinner />
				}
			</div>
		</>
	)
}