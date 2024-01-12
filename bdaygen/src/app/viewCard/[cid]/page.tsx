"use client"

import { collection, doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

import { db } from "@/app/_firebase/config";
import { CARD_COLLECTION } from '@/app/_firebase/util';
import Spinner from "@/app/_extraComponents/spinner";
import Image from 'next/image'
import styles from './styles.module.css'

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
		<>
			<div className="min-h-screen flex items-center justify-center bg-gray-100">
				{
					(recipientName !== "")
						?
						<div className={styles.cardContainer}>
							<div className={styles.fstCardInner}>
								<div className="w-inherit h-[30%]">
									<Image
										src="/imgs/Ribbons.png"
										width={761}
										height={411}
										quality={100}
										alt="decor-top"
									/>
								</div>
								<div className="w-[60%] h-[35%] mt-3">
									<Image
										src="/imgs/HPBD2.png"
										width={494}
										height={416}
										quality={100}
										alt="decor-top"
									/>
								</div>
								<div className="w-[40%] h-[15%] mt-3">
									<Image
										src="/imgs/Cake.png"
										width={320}
										height={216}
										quality={100}
										alt="decor-top"
									/>
								</div>
							</div>
							<div className={styles.sndCard}>
								<div className="pt-8 pl-8 text-[#616161] break-words text-5xl w-full">
									<span className={styles.fontAmaticSC}>To {recipientName},</span>
								</div>
								<div className="text-2xl text-[#212427] break-words whitespace-normal w-full font-medium px-4 pt-10 text-center">
									<span className={styles.fontAmaticSC}>{message}</span>
								</div>
								<div className="text-3xl text-[#616161] break-words w-full pr-8 text-right pt-10">
									<span className={styles.fontAmaticSC}>{signOff}</span>
								</div>
							</div>
						</div>

						: <Spinner />
				}
			</div>
		</>
	);
}