import {
	Auth,
	AuthError,
	UserCredential,
	signInAnonymously
} from 'firebase/auth';
import { useState, useCallback } from 'react';
import { AuthActionHook } from 'react-firebase-hooks/auth/dist/auth/types';

export type AnonActionHook = AuthActionHook<
  () => Promise<UserCredential | undefined>
>;

// Custom hook to work with firebase's sign in anonymously
export default function useSignInAnon(auth: Auth): AnonActionHook {
	const [error, setError] = useState<AuthError>();
	const [loggedInUser, setLoggedInUser] = useState<UserCredential>();
	const [loading, setLoading] = useState<boolean>(false);

	const signInAnon = useCallback(
		async () => {
			try {
				const user = await signInAnonymously(auth);
				setLoggedInUser(user);

				return user
			} catch (err) {
				setError(err as AuthError);
			} finally {
				setLoading(false);
			}
		},
		[auth]
	);

	return [signInAnon, loggedInUser, loading, error];
}