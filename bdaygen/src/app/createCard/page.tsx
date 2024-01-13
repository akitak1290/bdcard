"use client"

import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";

import { auth } from "@/app/_firebase/config";
import Spinner from "@/app/_extraComponents/spinner";
import ConfirmDialog from "./confirmDialog";
import CardInfoForm from "./CardInfoForm";
import StickersForm from "./StickersForm";

import { upperDecor, middleDecor, lowerDecor } from "./utils"

export default function CreateCard() {
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const [page, setPage] = useState(0);
	const [submitDisabled, setSubmitDisabled] = useState(true);

	const [recipientName, setRecipientName] = useState('');
	const [message, setMessage] = useState('');
	const [signOff, setSignOff] = useState('');

	const [curUpperDecor, setCurUpperDecor] = useState(Object.keys(upperDecor)[0]);
	const [curMiddleDecor, setCurMiddleDecor] = useState(Object.keys(middleDecor)[0]);
	const [curLowerDecor, setCurLowerDecor] = useState(Object.keys(lowerDecor)[0]);

	const [user, loading, error] = useAuthState(auth);
	const router = useRouter();
	useEffect(() => {
		if (!loading && !user) router.push("/signup");
	}, [user, loading, error])

	const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

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
				'curUpperDecor': curUpperDecor,
				'curMiddleDecor': curMiddleDecor,
				'curLowerDecor': curLowerDecor
			})
		});

		if (response.ok) {
			const data = await response.json();

			setIsDialogOpen(true);
			setRecipientName('');
			setMessage('');
			setSignOff('');

			await sleep(1500);
			router.push(`/viewCard/${data.docId}`);
		} else {
			console.log(response.status)
			// setPromptError(`Something went wrong, please try again later\n${response.status}`)
		}

	};

	if (loading || !user) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-100"	>
				<Spinner />
			</div>
		);
	}

	// TODO: tweak for responsive web design
	// TODO: could do with some refactoring
	// TODO: some hacky logic currently with the buttons
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
			<div className="bg-white p-8 m-auto rounded shadow-md w-full md:max-w-3xl max-w-md">
				{
					(page === 0)
						? <>
							<CardInfoForm
								recipientName={recipientName} message={message} signOff={signOff}
								setRecipientName={setRecipientName} setMessage={setMessage} setSignOff={setSignOff} />
							<div className="w-full flex flex-row-reverse">
								<button className="bg-blue-500 text-white py-2 px-4 rounded 
												hover:bg-blue-600 transition duration-300"
									onClick={() => {
										setPage(1);
										setTimeout(() => setSubmitDisabled(false), 200);
									}}>
									Next
								</button>
							</div>
						</>
						: <>
							<StickersForm
								recipientName={recipientName} message={message} signOff={signOff}
								curUpperDecor={curUpperDecor} curMiddleDecor={curMiddleDecor} curLowerDecor={curLowerDecor}
								setCurUpperDecor={setCurUpperDecor} setCurMiddleDecor={setCurMiddleDecor} setCurLowerDecor={setCurLowerDecor}/>
							<div className="w-full flex justify-between">
								<button className="bg-blue-500 text-white py-2 px-4 rounded 
											   hover:bg-blue-600 transition duration-300"
									onClick={() => {
										setPage(0);
										setSubmitDisabled(true)
									}}>
									Back
								</button>
								<button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 
											    transition duration-300 disabled:bg-slate-400"
									disabled={submitDisabled} onClick={(e) => handleSubmit(e)}>
									Submit
								</button>
							</div>
						</>
				}
				<ConfirmDialog isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} message={"Birthday Card Created!"} />
			</div>
		</div>
	);
}