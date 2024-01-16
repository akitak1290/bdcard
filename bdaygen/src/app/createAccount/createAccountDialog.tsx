import { ChangeEvent, useEffect, useState } from "react";
import { useAuthState, useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { auth } from "@/app/_firebase/config";
import Spinner from "@/app/_extraComponents/spinner";
import { AddUserToDb } from "@/app/_firebase/manageUsers";

export function CreateAccountDialog({ disableSignIn }: { disableSignIn: boolean }) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [promptError, setPromptError] = useState('');

	const [
		createUserWithEmailAndPassword,
		registeredUser,
		loading,
		error
	] = useCreateUserWithEmailAndPassword(auth);

	const [user, loadingAuth, errorAuth] = useAuthState(auth);

	useEffect(() => {
		if (error) {
			setPromptError(error.code.split('/')[1])
		}
	}, [error, loading])

	// so.. 1 concern is: this will always need to
	// be done first before other operations like
	// submit a card, else the user won't show up
	// in the Users col and the app will blown up
	// TODO: ?
	useEffect(() => {
		if (user) {
			AddUserToDb(user.uid);
		}
	}, [user])

	const handleSignUp = async () => {
		try {
			await createUserWithEmailAndPassword(email, password);

		} catch (e) {}

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
			<p className="text-2xl font-bold mb-6">Sign Up</p>
			{(promptError) && <p className='text-b text-amber-700 text-center'>{promptError}</p>}
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
			{
				!disableSignIn &&
				<p className="mt-4 text-center w-full">
					Already have an account?
					<Link href="/signIn" className="text-amber-500"> sign in
					</Link></p>
			}
		</div>
	)
}