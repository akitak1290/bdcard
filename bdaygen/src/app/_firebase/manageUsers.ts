import { setDoc, doc, collection } from "firebase/firestore";
import { db } from "./config";
import { USER_COLLECTION } from "./util";

export async function AddUserToDb(id: string) {
	try {
		await setDoc(doc(db, USER_COLLECTION, id), {
			timeCreated: Date().toString()
		});
		return id;
	} catch(e) {}
	return;
}