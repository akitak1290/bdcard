"use client"

import { collection, doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

import { db } from "@/app/_firebase/config";
import { CARD_COLLECTION } from '@/app/_firebase/util';
import Spinner from "@/app/_extraComponents/spinner";
import Image from 'next/image'

async function fetchDocs(id: string) {
	const docRef = doc(db, CARD_COLLECTION, id);

	try {
		const docSnap = await getDoc(docRef);
		if (docSnap.exists()) {
			return docSnap.data()
		}
	} catch (e) {
		console.log(e)
	}

	return {}
}

export default function ViewCard({ params }: { params: { cid: string } }) {
	const [recipientName, setRecipientName] = useState('');
	const [message, setMessage] = useState('');
	const [signOff, setSignOff] = useState('');

	useEffect(() => {
		// on mount
		fetchDocs(params.cid).then((value) => {
			setRecipientName(value.recipientName);
			setMessage(value.message);
			setSignOff(value.signOff);
		})
	}, [])

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			{
				(recipientName !== "")
					?
					<div className="bg-white p-8 rounded shadow-md w-full max-w-md">
						<h2 className="text-2xl font-bold mb-6">Happy Birthday!</h2>
						<div className="mb-4">
							<p className="block text-gray-700 text-sm font-bold mb-2">
								From {recipientName}
							</p>
						</div>
						<div className="mb-4">
							<p className="block text-gray-700 text-sm font-bold mb-2">
								{message}
							</p>
						</div>
						<div className="mb-4">
							<p className="block text-gray-700 text-sm font-bold mb-2">
								with love <br />
								{signOff}
							</p>
						</div>

					</div>

					: <Spinner />
			}
		</div>
	);
}