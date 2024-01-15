"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
	const [redirecting, setRedirecting] = useState(false);
	const router = useRouter();

	return (
		<div className="glow flex flex-col justify-center max-w-screen-2xl md:w-inherit py-0 lg:px-60 md:px-40 px-5 [&>*]:lg:pb-20 [&>*]:md:pb-10 [&>*]:pb-10 w-[100%]">
			<h3 className="lg:text-7xl md:text-5xl text-2xl font-bold text-center">Create and send birthday cards to your friends and loved ones</h3>
			<div className="flex items-center justify-center">
				<button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
					onClick={() => {
						setRedirecting(true);
						router.push("/createCard")
					}}>
					{(redirecting) ? "..." : "Build your card"}
				</button>
			</div>
		</div>
	)
}