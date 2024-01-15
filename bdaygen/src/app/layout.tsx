import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/app/_extraComponents/navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'BDday Express',
	description: 'A simple app to generate birthday cards',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<div className="min-h-screen w-full flex flex-col flex-start items-center bg-gray-100">
					<Navbar />
					<div className='grow flex'>
						{children}
					</div>
				</div>
			</body>
		</html>
	)
}
