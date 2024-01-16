"use client"

import { Dispatch, Fragment, SetStateAction, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';

import { auth } from "@/app/_firebase/config";
import useSignInAnon from '@/app/_firebase/AuthAnon';
import { SignInDialog } from '@/app/signIn/signInDialog';
import { CreateAccountDialog } from '@/app/createAccount/createAccountDialog';
import { useAuthState } from 'react-firebase-hooks/auth';
import { postNewCard } from '@/app/_firebase/manageCards';
import Link from 'next/link';

function classNames(...classes: any[]) {
	return classes.filter(Boolean).join(' ');
}

function CopyIcon() {
	return (
		<svg
			height={'30px'}
			width={'30px'}
			xmlns="http://www.w3.org/2000/svg"
			xmlnsXlink="http://www.w3.org/1999/xlink"
			viewBox="0 0 210.107 210.107"
			xmlSpace="preserve"
		>
			<g>
				<path
					className="fill-current text-gray-800"
					d="M168.506,0H80.235C67.413,0,56.981,10.432,56.981,23.254v2.854h-15.38 c-12.822,0-23.254,10.432-23.254,23.254v137.492c0,12.822,10.432,23.254,23.254,23.254h88.271 c12.822,0,23.253-10.432,23.253-23.254V184h15.38c12.822,0,23.254-10.432,23.254-23.254V23.254C191.76,10.432,181.328,0,168.506,0z M138.126,186.854c0,4.551-3.703,8.254-8.253,8.254H41.601c-4.551,0-8.254-3.703-8.254-8.254V49.361 c0-4.551,3.703-8.254,8.254-8.254h88.271c4.551,0,8.253,3.703,8.253,8.254V186.854z M176.76,160.746 c0,4.551-3.703,8.254-8.254,8.254h-15.38V49.361c0-12.822-10.432-23.254-23.253-23.254H71.981v-2.854 c0-4.551,3.703-8.254,8.254-8.254h88.271c4.551,0,8.254,3.703,8.254,8.254V160.746z"
				/>
			</g>
		</svg>
	);
};

function CheckMarkIcon() {
	return (
		<svg
			height={'30px'}
			width={'30px'}
			xmlns="http://www.w3.org/2000/svg"
			xmlnsXlink="http://www.w3.org/1999/xlink"
			viewBox="0 0 17.837 17.837"
			xmlSpace="preserve">
			<g>
				<path className="fill-current text-gray-800"
					d="M16.145,2.571c-0.272-0.273-0.718-0.273-0.99,0L6.92,10.804l-4.241-4.27
					c-0.272-0.274-0.715-0.274-0.989,0L0.204,8.019c-0.272,0.271-0.272,0.717,0,0.99l6.217,6.258c0.272,0.271,0.715,0.271,0.99,0
					L17.63,5.047c0.276-0.273,0.276-0.72,0-0.994L16.145,2.571z"
				/>
			</g>
		</svg>
	)
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
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		setPromptError('');
		setAuthType(0);
		if (user && isOpen) {
			setLoading(false);
			postNewCard(user.uid, postObj)
				.then((result) => {
					if (result.docRef && result.errorCode == 0) setPromptMessage(`/viewCard/${result.docRef.id}`);
					else {
						// TODO: 5 is a hardcoded restriction, change it
						if (result.errorCode == 1) {
							setPromptError('You can only have 5 cards at a time');
						} else {
							setPromptError('Failed to post, please try again later');
						}
					}
				});
		}
		// if (!user && isOpen) {
		// 	setPromptMessage();
		// }
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
				setCopied(false);
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
									{
										promptMessage != '' ?
											<div>
												Share your card:
												<div className='bg-blue-100 rounded flex justify-between items-center p-3 mt-5'>
													<Link href={promptMessage} className='break-words'>{promptMessage}</Link>
													<button onClick={() => {
														navigator.clipboard.writeText(`bdayexpress.vercel.app${promptMessage}`); // quick and dirty solve
														setCopied(true);
													}} disabled={copied}>
														{(copied) ? <CheckMarkIcon /> : <CopyIcon />}
													</button>
												</div>
												{(copied) && <p className='text-b text-amber-700 text-center'>copied to clipboard</p>}
											</div>
											: <p>Sign in to save your card!</p>
									}
									{(promptError !== "") && <p className='text-b text-amber-700 text-center'>{promptError}</p>}
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
											<p>or</p>
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
