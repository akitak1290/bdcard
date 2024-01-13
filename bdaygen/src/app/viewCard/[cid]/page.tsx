"use client"

import {  doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

// import { jsConfetti } from '@/app/_confetti/config';
import JSConfetti from 'js-confetti'

import { db } from "@/app/_firebase/config";
import { CARD_COLLECTION } from '@/app/_firebase/util';
import Spinner from "@/app/_extraComponents/spinner";
import Image from 'next/image'
import styles from './styles.module.css'
import { upperDecor, middleDecor, lowerDecor } from "@/app/createCard/utils";

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

	const [curUpperDecor, setCurUpperDecor] = useState(Object.keys(upperDecor)[0]);
	const [curMiddleDecor, setCurMiddleDecor] = useState(Object.keys(middleDecor)[0]);
	const [curLowerDecor, setCurLowerDecor] = useState(Object.keys(lowerDecor)[0]);
	
	const [gotData, setGotData] = useState(false);

	useEffect(() => {
		// one time thing
		fetchDocs(params.cid).then((value) => {
			setRecipientName(value.recipientName);
			setMessage(value.message);
			setSignOff(value.signOff);
			setCurUpperDecor(value.curUpperDecor);
			setCurMiddleDecor(value.curMiddleDecor);
			setCurLowerDecor(value.curLowerDecor);
			setGotData(true);

			// ! THIS THING CREATES A CANVAS OBJECT IN BODY
			const jsConfetti = new JSConfetti();
			jsConfetti.addConfetti();
		})
	}, [])

	if (!gotData) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-100">
				<Spinner />
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<div className={styles.cardContainer}>
				<div className={styles.fstCardInner}>
					<div className="w-inherit h-[30%]">
						<Image
							src={`/imgs/${upperDecor[curUpperDecor as keyof typeof upperDecor]}`}
							width={761}
							height={411}
							quality={100}
							alt="decor-top"
						/>
					</div>
					<div className="w-[60%] h-[35%] mt-3">
						<Image
							src={`/imgs/${middleDecor[curMiddleDecor as keyof typeof middleDecor]}`}
							width={494}
							height={416}
							quality={100}
							alt="decor-top"
						/>
					</div>
					<div className="w-[40%] h-[15%] mt-3">
						<Image
							src={`/imgs/${lowerDecor[curLowerDecor as keyof typeof lowerDecor]}`}
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
		</div>
	);
}