"use client"

import { Dispatch, Fragment, SetStateAction, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';

import { auth } from "@/app/_firebase/config";
import useSignInAnon from '@/app/_firebase/AuthAnon';
import { SignInDialog } from '../signIn/page';
import { CreateAccountDialog } from '../createAccount/page';
import { useAuthState } from 'react-firebase-hooks/auth';
import { PostNewCard } from '@/app/_firebase/manageCards';

function classNames(...classes: any[]) {
	return classes.filter(Boolean).join(' ');
}

type PropType = {
	isOpen: boolean,
	setIsOpen: Dispatch<SetStateAction<boolean>>,
	postObj: Object
}

// TODO: refac
// TODO: atrocious nested ternary, please fix when sober

export default function SubmitDialog(prop: PropType) {
	const { isOpen, setIsOpen, postObj } = prop;

	const [user, loadingUser, errorUser] = useAuthState(auth);

	const [signInAnon] = useSignInAnon(auth);
	
	const [loading, setLoading] = useState(false);
	const [authType, setAuthType] = useState(0);
	const [promptMessage, setPromptMessage] = useState('');
	const [promptError, setPromptError] = useState('');

	useEffect(() => {
		setPromptError('');
		setAuthType(0);
		if (user && isOpen) {
			setLoading(false);
			PostNewCard(user.uid, postObj)
				.then((docRef) => {
					if (docRef) setPromptMessage(docRef.id);
					else setPromptError('Failed to post, please try again later');
				});
		} 
		if (!user && isOpen) {
			setPromptMessage('Sign in to save your card!');
		}
	}, [user, isOpen, postObj])

	const handleSignInAnon = async () => {
		if (loading) return;

		setPromptError('');

		try {
			setLoading(true);
			await signInAnon();
		} catch (e) {
			setPromptError('Something went wrong, please try again later');
		}
	}

	return (
		<Transition appear show={isOpen} as={Fragment}>
			<Dialog as="div" className="relative z-10" onClose={() => {
				setAuthType(0);
				setPromptMessage('');
				setPromptError('');
				setIsOpen(false);
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
							<Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
								<Dialog.Title
									as="h3"
									className="text-lg font-medium leading-6 text-gray-900 text-center"
								>
									{promptMessage}
									{(promptError !== "") && <h2 className='text-b text-amber-700 text-center'>{promptError}</h2>}
								</Dialog.Title>
								{
									(authType === 0) ?
										<div className={classNames(
											(user) ? "hidden" : "block",
											"w-full flex justify-center pt-5 flex-col gap-4 text-center"
										)}>
											<button
												type="button"
												className={classNames(
													"inline-flex justify-center rounded-md border border-transparent",
													"bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900",
													"hover:bg-blue-200 focus:outline-none focus-visible:ring-2",
													"focus-visible:ring-blue-500 focus-visible:ring-offset-2",
													"disabled:bg-slate-400",
													loading ? "disabled" : "enabled:"
												)}
												onClick={() => handleSignInAnon()}
											>
												{(loading) ? "Signing you in..." : "Sign in Anonymously"}
											</button>
											<button
												type="button"
												className={classNames(
													"inline-flex justify-center rounded-md border border-transparent",
													"bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900",
													"hover:bg-blue-200 focus:outline-none focus-visible:ring-2",
													"focus-visible:ring-blue-500 focus-visible:ring-offset-2",
													"disabled:bg-slate-400",
													loading ? "disabled" : "enabled:"
												)}
												onClick={() => setAuthType(1)}
											>
												{(loading) ? "Signing you in..." : "Sign in with Email"}
											</button>
											<h2>or</h2>
											<button
												type="button"
												className={classNames(
													"inline-flex justify-center rounded-md border border-transparent",
													"bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900",
													"hover:bg-blue-200 focus:outline-none focus-visible:ring-2",
													"focus-visible:ring-blue-500 focus-visible:ring-offset-2",
													"disabled:bg-slate-400",
													loading ? "disabled" : "enabled:"
												)}
												onClick={() => setAuthType(2)}
											>
												{(loading) ? "Signing you in..." : "Sign up"}
											</button>
										</div>
										: (authType === 1) ?
											<SignInDialog disableSignUp={true} />
											: <CreateAccountDialog disableSignIn={true} />
								}

							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	)
}
