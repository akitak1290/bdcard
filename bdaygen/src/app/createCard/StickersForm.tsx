"use client"

import { Dispatch, SetStateAction, useState } from "react"
import Image from 'next/image'

import styles from './styles.module.css'
import { RadioGroup } from "@headlessui/react"
import { upperDecor, middleDecor, lowerDecor } from "./utils"

type PropType = {
	recipientName: string,
	message: string,
	signOff: string,
	curUpperDecor: string,
	curMiddleDecor: string,
	curLowerDecor: string,
	setCurUpperDecor: Dispatch<SetStateAction<string>>,
	setCurMiddleDecor: Dispatch<SetStateAction<string>>,
	setCurLowerDecor: Dispatch<SetStateAction<string>>
}

export default function StickersForm(prop: PropType) {
	const {
		recipientName,
		message,
		signOff,
		curUpperDecor,
		curMiddleDecor,
		curLowerDecor,
		setCurUpperDecor,
		setCurMiddleDecor,
		setCurLowerDecor
	} = prop;

	return (
		<div className="w-full flex flex-col justify-center items-center">
			<p className="text-2xl font-bold mb-6">Add your personal touch!</p>
			<div className="flex md:flex-row-reverse flex-col gap-6">
				<div className="flex flex-col md:gap-8 gap-2">
					<RadioGroup value={curUpperDecor} onChange={setCurUpperDecor}>
						<RadioGroup.Label className="sr-only">Middle Decor</RadioGroup.Label>
						<div className="flex flex-row gap-4">
							{Object.keys(upperDecor).map((key) => (
								<RadioGroup.Option
									key={key}
									value={key}
									className={({ active, checked }) =>
										` ${checked ? 'bg-sky-900/75 text-white' : 'bg-white'}
									relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none
									md:h-[80px] h-auto w-[95px]`
									}
								>
									{({ active, checked }) => (
										<>
											<div className="flex w-full items-center justify-between">
												<div className="flex items-center">
													<div className="text-sm">
														<RadioGroup.Label
															as="p"
															className={`font-medium  ${checked ? 'text-white' : 'text-gray-900'
																}`}
														>
															{key}
														</RadioGroup.Label>
														<RadioGroup.Description
															as="span"
															className={`inline ${checked ? 'text-sky-100' : 'text-gray-500'
																}`}
														>
															<Image
																src={`/imgs/${upperDecor[key as keyof typeof upperDecor]}`}
																priority={true}
																width={761}
																height={411}
																quality={100}
																alt={key}
																className="hidden md:block"
															/>
														</RadioGroup.Description>
													</div>
												</div>
											</div>
										</>
									)}
								</RadioGroup.Option>
							))}
						</div>
					</RadioGroup>
					<RadioGroup value={curMiddleDecor} onChange={setCurMiddleDecor}>
						<RadioGroup.Label className="sr-only">Upper Decor</RadioGroup.Label>
						<div className="flex flex-row gap-4">
							{Object.keys(middleDecor).map((key) => (
								<RadioGroup.Option
									key={key}
									value={key}
									className={({ active, checked }) =>
										` ${checked ? 'bg-sky-900/75 text-white' : 'bg-white'}
									relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none
									md:h-[80px] h-auto w-[95px]`
									}
								>
									{({ active, checked }) => (
										<>
											<div className="flex w-full items-center justify-between">
												<div className="flex items-center">
													<div className="text-sm">
														<RadioGroup.Label
															as="p"
															className={`font-medium  ${checked ? 'text-white' : 'text-gray-900'
																}`}
														>
															{key}
														</RadioGroup.Label>
														<RadioGroup.Description
															as="span"
															className={`inline ${checked ? 'text-sky-100' : 'text-gray-500'
																}`}
														>
															<Image
																src={`/imgs/${middleDecor[key as keyof typeof middleDecor]}`}
																priority={true}
																width={761}
																height={411}
																quality={100}
																alt={key}
																className="hidden md:block"
															/>
														</RadioGroup.Description>
													</div>
												</div>
											</div>
										</>
									)}
								</RadioGroup.Option>
							))}
						</div>
					</RadioGroup>
					<RadioGroup value={curLowerDecor} onChange={setCurLowerDecor}>
						<RadioGroup.Label className="sr-only">Lower Decor</RadioGroup.Label>
						<div className="flex flex-row gap-4">
							{Object.keys(lowerDecor).map((key) => (
								<RadioGroup.Option
									key={key}
									value={key}
									className={({ active, checked }) =>
										` ${checked ? 'bg-sky-900/75 text-white' : 'bg-white'}
									relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none
									md:h-[80px] h-auto w-[95px]`
									}
								>
									{({ active, checked }) => (
										<>
											<div className="flex w-full items-center justify-between">
												<div className="flex items-center">
													<div className="text-sm">
														<RadioGroup.Label
															as="p"
															className={`font-medium  ${checked ? 'text-white' : 'text-gray-900'
																}`}
														>
															{key}
														</RadioGroup.Label>
														<RadioGroup.Description
															as="span"
															className={`inline ${checked ? 'text-sky-100' : 'text-gray-500'
																}`}
														>
															<Image
																src={`/imgs/${lowerDecor[key as keyof typeof lowerDecor]}`}
																priority={true}
																width={761}
																height={411}
																quality={100}
																alt={key}
																className="hidden md:block"
															/>
														</RadioGroup.Description>
													</div>
												</div>
											</div>
										</>
									)}
								</RadioGroup.Option>
							))}
						</div>
					</RadioGroup>
				</div>
				<div className="w-full flex mb-5 items-center justify-center">
					<div className={styles.cardContainer}>
						<div className={styles.fstCardInner}>
							<div className="w-inherit h-[30%]">
								<Image
									src={`/imgs/${upperDecor[curUpperDecor as keyof typeof upperDecor]}`}
									width={761}
									height={411}
									quality={100}
									alt="decor-top"
								/>
							</div>
							<div className="w-[60%] h-[35%] mt-3">
								<Image
									src={`/imgs/${middleDecor[curMiddleDecor as keyof typeof middleDecor]}`}
									width={494}
									height={416}
									quality={100}
									alt="decor-top"
								/>
							</div>
							<div className="w-[40%] h-[15%] mt-3">
								<Image
									src={`/imgs/${lowerDecor[curLowerDecor as keyof typeof lowerDecor]}`}
									width={320}
									height={216}
									quality={100}
									alt="decor-top"
								/>
							</div>
						</div>
						<div className={styles.sndCard}>
							<div className="pt-8 pl-8 text-[#616161] break-words text-5xl w-full">
								<span className={styles.fontAmaticSC}>To {recipientName},</span>
							</div>
							<div className="text-2xl text-[#212427] break-words whitespace-normal w-full font-medium px-4 pt-10 text-center">
								<span className={styles.fontAmaticSC}>{message}</span>
							</div>
							<div className="text-3xl text-[#616161] break-words w-full pr-8 text-right pt-10">
								<span className={styles.fontAmaticSC}>{signOff}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}