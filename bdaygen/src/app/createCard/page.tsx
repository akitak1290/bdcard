"use client"

import { ChangeEvent, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";

import ConfirmDialog from "./confirmDialog";
import { auth } from "@/app/_firebase/config";
import Spinner from "@/app/_extraComponents/spinner";

export default function CreateCard() {
	const [recipientName, setRecipientName] = useState('');
	const [message, setMessage] = useState('');
	const [signOff, setSignOff] = useState('');

	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [promptError, setPromptError] = useState('');
	const [submitting, setSubmitting] = useState(false);

	const [user, loading, error] = useAuthState(auth);

	const router = useRouter();

	useEffect(() => {
		if (!loading && !user) router.push("/signup");
	}, [user, loading, error])

	const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// TODO: is adding user id as public data like
		// TODO: this really a good idea? change later?
		const response = await fetch('/api', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				'recipientName': recipientName,
				'message': message,
				'signOff': signOff,
				'uid': user!.uid
			})
		});

		if (response.ok) {
			const data = await response.json();

			setIsDialogOpen(true);
			setSubmitting(true);
			setRecipientName('');
			setMessage('');
			setSignOff('');

			await sleep(1500);
			setSubmitting(false);
			router.push(`/viewCard/${data.docId}`);
		} else {
			console.log(response.status)
			setPromptError(`Something went wrong, please try again later\n${response.status}`)
		}

	};

	const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
		setRecipientName(e.target.value)
		if (promptError !== '') setPromptError('');
	}

	const handleMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		setMessage(e.target.value)
		if (promptError !== '') setPromptError('');
	}

	const handleSignOffChange = (e: ChangeEvent<HTMLInputElement>) => {
		setSignOff(e.target.value)
		if (promptError !== '') setPromptError('');
	}

	// TODO: tweak for responsive web design
	// TODO: could do with some refactoring
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			{
				(!loading && user) ?
					<div className="bg-white p-8 rounded shadow-md w-full max-w-md">
						<h2 className="text-2xl font-bold mb-6">Build a Card!</h2>
						<form onSubmit={handleSubmit}>
							<div className="mb-4">
								<label htmlFor="recipientName" className="block text-gray-700 text-sm font-bold mb-2">
									Recipient's Name
								</label>
								<input
									type="text"
									id="recipientName"
									value={recipientName}
									onChange={handleNameChange}
									className="w-full border p-2 rounded"
									required
								/>
							</div>
							<div className="mb-4">
								<label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">
									Message
								</label>
								<textarea
									id="message"
									value={message}
									onChange={handleMessageChange}
									className="w-full border p-2 rounded"
									rows={4}
									required
								></textarea>
							</div>
							<div className="mb-4">
								<label htmlFor="signOff" className="block text-gray-700 text-sm font-bold mb-2">
									SignOff
								</label>
								<input
									type="text"
									id="signOff"
									value={signOff}
									onChange={handleSignOffChange}
									className="w-full border p-2 rounded"
									required
								/>
							</div>
							<button
								type="submit"
								className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
							>
								{submitting ? '...' : 'Create'}
							</button>
						</form>
					</div>
					: <Spinner />
			}
			<ConfirmDialog isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} message={"Birthday Card Created!"} />
		</div>
	);
}
