import { setDoc, doc, collection } from "firebase/firestore";
import { db } from "./config";
import { USER_COLLECTION } from "./util";

export async function AddUserToDb(id: string) {
	await setDoc(doc(db, USER_COLLECTION, id), {
		uid: id,
		timeCreated: Date().toString()
	});
}