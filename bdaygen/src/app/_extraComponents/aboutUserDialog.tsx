"use client"

import { Dispatch, Fragment, SetStateAction, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Dialog, Transition } from '@headlessui/react';
import { deleteUser, signOut } from "firebase/auth";
import { collection, getDocs, query } from 'firebase/firestore';

import { auth, db } from "@/app/_firebase/config";
import { AddUserToDb } from "@/app/_firebase/manageUsers";
import useSignInAnon from '@/app/_firebase/AuthAnon';
import { SignInDialog } from '@/app/signIn/signInDialog';
import { CreateAccountDialog } from '@/app/createAccount/createAccountDialog';
import { CARD_COLLECTION, USER_COLLECTION } from '../_firebase/util';
import Link from 'next/link';

function classNames(...classes: any[]) {
	return classes.filter(Boolean).join(' ');
}

async function getUserCards(uid: string) {
	const cardIds: string[] = []
	const querySnapshot = await getDocs(collection(db, USER_COLLECTION, uid, CARD_COLLECTION));
	querySnapshot.forEach((doc) => {
		// doc.data() is never undefined for query doc snapshots
		cardIds.push(doc.id);
	});
	return cardIds;
}

type PropType = {
	setIsOpen: Dispatch<SetStateAction<boolean>>,
	isOpen: boolean,
	message: string,
}

// TODO: refac
// TODO: atrocious nested ternary, please fix when sober

export default function AboutUserDialog(prop: PropType) {
	const { isOpen, setIsOpen, message } = prop;
	const [signInAnon, loggedInUser, loadingUser, errorUser] = useSignInAnon(auth);

	const [loading, setLoading] = useState(false);
	const [authType, setAuthType] = useState(0);
	const [promptError, setPromptError] = useState('');
	const [cardIds, setCardIds] = useState<string[]>([]);

	const [user, loadingAuth, errorAuth] = useAuthState(auth);

	useEffect(() => {
		if (!loadingAuth && user) {
			setLoading(false);
			setAuthType(0);
		};
		if (errorAuth) setPromptError("Something when wrong, please try again later");
	}, [user, loadingAuth, errorAuth])

	useEffect(() => {
		if (!loadingUser && loggedInUser) {
			setLoading(false);
			AddUserToDb(loggedInUser.user.uid);
		}
		if (errorUser) setPromptError("Something when wrong, please try again later");
	}, [loggedInUser, loadingUser, errorUser])

	useEffect(() => {
		if (isOpen && user) {
			// i want this to trigger everytime the dialog
			// is open so new data is fetched, might need
			// to add a cache
			getUserCards(user.uid).then((ids) => {
				setCardIds(ids);
			});
		}
	}, [isOpen, user])

	const handleSignInAnon = async () => {
		if (loading) return;

		try {
			setLoading(true);
			await signInAnon();
		} catch (e) {
			setPromptError("Something went wrong, please try again later");
		}
	}

	const handleSignOut = async () => {
		try {
			await signOut(auth);
		} catch (e) {
			setPromptError("Something went wrong, please try again later");
		}
	}

	const handleDeleteAccount = async () => {
		if (!user) return;

		try {
			await deleteUser(user);
		} catch (e) {
			setPromptError("Something went wrong, please try again later");
		}
	}

	return (
		<Transition appear show={isOpen} as={Fragment}>
			<Dialog as="div" className="relative z-10" onClose={() => {
				setIsOpen(false);
				setPromptError("");
				setAuthType(0);
			}}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-black/25" />
				</Transition.Child>

				<div className="fixed inset-0 overflow-y-auto">
					<div className="flex min-h-full items-center justify-center p-4 text-center">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<Dialog.Panel className="w-full flex flex-col max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
								<Dialog.Title
									as="h3"
									className="text-lg font-medium leading-6 text-gray-900 text-center"
								>
									{(user) ? message : "Sign in to save your card"}
								</Dialog.Title>
								{(promptError !== "") && <h2 className='text-b text-amber-700 text-center'>{promptError}</h2>}
								{
									(authType === 0) ?
										<div className={classNames(
											(user) ? "hidden" : "block",
											"w-full flex justify-center pt-5 flex-col gap-4 text-center"
										)}>
											<button
												type="button"
												disabled={loading}
												className={classNames(
													"inline-flex justify-center rounded-md border border-transparent",
													"bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900",
													"enabled:hover:bg-blue-200 focus:outline-none focus-visible:ring-2",
													"focus-visible:ring-blue-500 focus-visible:ring-offset-2",
													"disabled:bg-slate-200 disabled:text-white",
												)}
												onClick={() => handleSignInAnon()}
											>
												{(loading) ? "Signing you in..." : "Sign in Anonymously"}
											</button>
											<button
												type="button"
												disabled={loading}
												className={classNames(
													"inline-flex justify-center rounded-md border border-transparent",
													"bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900",
													"hover:bg-blue-200 focus:outline-none focus-visible:ring-2",
													"focus-visible:ring-blue-500 focus-visible:ring-offset-2",
													"disabled:bg-slate-200 disabled:text-white"
												)}
												onClick={() => setAuthType(1)}
											>
												{(loading) ? "Signing you in..." : "Sign in with Email"}
											</button>
											<h2>or</h2>
											<button
												type="button"
												disabled={loading}
												className={classNames(
													"inline-flex justify-center rounded-md border border-transparent",
													"bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900",
													"hover:bg-blue-200 focus:outline-none focus-visible:ring-2",
													"focus-visible:ring-blue-500 focus-visible:ring-offset-2",
													"disabled:bg-slate-200 disabled:text-white"
												)}
												onClick={() => setAuthType(2)}
											>
												{(loading) ? "Signing you in..." : "Sign up"}
											</button>
											{/* <SignInDialog /> */}
										</div>
										: (authType === 1) ?
											<SignInDialog disableSignUp={true} />
											: <CreateAccountDialog disableSignIn={true} />
								}
								{(user) &&
									<>
										<button className='py-5' onClick={handleSignOut}>Sign out</button>
										{(cardIds) && cardIds.map((v, idx) =>
											<h2 className='text-b text-center py-3' key={idx}>
												<Link href={`/viewCard/${v}`} onClick={() => setIsOpen(false)}>{v}</Link>
											</h2>
										)}
										<button className='py-5' onClick={handleDeleteAccount}>Delete account</button>
									</>}
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	)
}
