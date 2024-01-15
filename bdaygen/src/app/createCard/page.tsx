"use client"

import {useState } from "react";

import { upperDecor, middleDecor, lowerDecor } from "./utils"
import SubmitDialog from "./submitDialog";
import CardInfoForm from "./CardInfoForm";
import StickersForm from "./StickersForm";

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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		setIsDialogOpen(true);

		// setRecipientName('');
		// setMessage('');
		// setSignOff('');
	};

	// if (loading || !user) {
	// 	return (
	// 		<div className="min-h-screen flex items-center justify-center bg-gray-100"	>
	// 			<Spinner />
	// 		</div>
	// 	);
	// }

	// TODO: tweak for responsive web design
	// TODO: could do with some refactoring
	// TODO: some hacky logic currently with the buttons
	return (
		<div className="flex flex-col items-center justify-center bg-gray-100">
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
								setCurUpperDecor={setCurUpperDecor} setCurMiddleDecor={setCurMiddleDecor} setCurLowerDecor={setCurLowerDecor} />
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
				<SubmitDialog isOpen={isDialogOpen} setIsOpen={setIsDialogOpen}
					postObj={{
						'recipientName': recipientName,
						'message': message,
						'signOff': signOff,
						'curUpperDecor': curUpperDecor,
						'curMiddleDecor': curMiddleDecor,
						'curLowerDecor': curLowerDecor
					}}
				/>
			</div>
		</div>
	);
}