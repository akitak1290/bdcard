import { addDoc, collection } from "firebase/firestore";
import { CARD_COLLECTION, USER_COLLECTION } from "./util";
import { db } from "./config";


export async function PostNewCard(uid: string, data: Object) {
	try {
		const dataClone: any = structuredClone(data);
		dataClone["timeCreated"] = Date().toString();
		const cardCollectionRef = collection(db, USER_COLLECTION, uid, CARD_COLLECTION);
		const docRef = await addDoc(cardCollectionRef, data);
		return docRef;
	} catch(e) {}
	return;
}