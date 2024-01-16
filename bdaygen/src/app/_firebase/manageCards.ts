import { DocumentData, DocumentReference, addDoc, collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { CARD_COLLECTION, USER_COLLECTION } from "./util";
import { db } from "./config";

export async function getUserCards(uid: string) {
	const cardIds: string[] = []
	const querySnapshot = await getDocs(collection(db, USER_COLLECTION, uid, CARD_COLLECTION));
	querySnapshot.forEach((doc) => {
		// doc.data() is never undefined for query doc snapshots
		cardIds.push(doc.id);
	});
	return cardIds;
}

export async function deleteCard(uid: string, cardId: string) {
	await deleteDoc(doc(db, USER_COLLECTION, uid, CARD_COLLECTION, cardId));
}

type PostNewCardReturn = {
	docRef: DocumentReference<any, DocumentData> | undefined,
	errorCode: number
}

export async function postNewCard(uid: string, data: Object): Promise<PostNewCardReturn> {
	try {
		const cards = await getUserCards(uid);
		if (cards.length >= 5) return { docRef: undefined, errorCode: 1 }

		const dataClone: any = structuredClone(data);
		dataClone["timeCreated"] = Date().toString();

		const cardCollectionRef = collection(db, USER_COLLECTION, uid, CARD_COLLECTION);
		const docRef = await addDoc(cardCollectionRef, dataClone);
		setDoc(docRef, { id: docRef.id }, { merge: true }); // some workaround
		return { docRef, errorCode: 0 };
	} catch (e) {
		return { docRef: undefined, errorCode: 2 };
	}
}