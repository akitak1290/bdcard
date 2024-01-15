"use client"

import Link from "next/link";
import { useState } from "react";
import AboutUserDialog from "./aboutUserDialog";

export default function Navbar() {
	const [openDialog, setOpenDialog] = useState(false);

	return (
		<div className="flex justify-between w-full py-5 md:px-20 px-4">
			<Link href="/">BDayExpress's logo</Link>
			<button onClick={() => setOpenDialog(true)}>Me</button>
			<AboutUserDialog isOpen={openDialog} setIsOpen={setOpenDialog} message={"Your Account"}/>
		</div>
	)
}