import { addDoc, collection } from 'firebase/firestore';
import { NextResponse } from 'next/server'
import { db } from '@/app/_firebase/config';
import { CARD_COLLECTION } from '@/app/_firebase/util';

export async function GET(req: Request) {
	return NextResponse.json({ message: 'Hello from Next.js!' }, { status: 200 })
}

export async function POST(req: Request) {
	let res
	let status

	const formData = await req.json();
	// TODO: use zod if needed for data validation
	// https://zod.dev/?id=basic-usage
	try {
		const docRef = await addDoc(collection(db, CARD_COLLECTION), formData);
		res = { message: 'Wrote to DB', docId: docRef.id, cardData: formData }
		status = 200
	} catch (e: any) {
		res = { error: `Error adding document: ${e.message}` }
		status = 500
	}

	return NextResponse.json(res, { status });
}