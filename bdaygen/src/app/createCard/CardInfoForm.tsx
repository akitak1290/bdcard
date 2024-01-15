import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";

type PropType = {
	recipientName: string,
	message: string,
	signOff: string,
	setRecipientName: Dispatch<SetStateAction<string>>,
	setMessage: Dispatch<SetStateAction<string>>,
	setSignOff: Dispatch<SetStateAction<string>>
}

export default function CardInfoForm(prop: PropType) {
	const {
		recipientName,
		message,
		signOff,
		setRecipientName,
		setMessage,
		setSignOff
	} = prop

	const [promptError, setPromptError] = useState('');
	const [submitting, setSubmitting] = useState(false);

	const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));



	const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
		setRecipientName(e.target.value)
		// if (promptError !== '') setPromptError('');
	}

	const handleMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		setMessage(e.target.value)
		// if (promptError !== '') setPromptError('');
	}

	const handleSignOffChange = (e: ChangeEvent<HTMLInputElement>) => {
		setSignOff(e.target.value)
		// if (promptError !== '') setPromptError('');
	}

	return (
		<div className="h-[500px]">
			<h2 className="text-2xl font-bold mb-6">Let them know your thought!</h2>
			<form>
				<div className="mb-4">
					<label htmlFor="recipientName" className="block text-gray-700 text-sm font-bold mb-2">
						Recipient&apos;s Name
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
						Message <span className="text-gray-400 font-light">(maximum 250 characters)</span>
					</label>
					<textarea
						id="message"
						value={message}
						onChange={handleMessageChange}
						className="w-full border p-2 rounded"
						rows={8}
						required
						maxLength={250}
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
			</form>
		</div>
	)
}