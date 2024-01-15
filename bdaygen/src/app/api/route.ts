import { addDoc, collection } from 'firebase/firestore';
import { NextResponse } from 'next/server'
import { db } from '@/app/_firebase/config';
import { CARD_COLLECTION } from '@/app/_firebase/util';

export async function GET(req: Request) {
	return NextResponse.json({ message: 'Hello from Next.js!' }, { status: 200 })
}