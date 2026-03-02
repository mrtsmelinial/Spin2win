import React, { useEffect, useRef, useState } from 'react'
import NumberFlow from '@number-flow/react'

const slides = [
	{
		title: 'big',
		src: '/img/jackpot-big.png',
		amount: 148.10,
	},
	{
		title: 'super',
		src: '/img/jackpot-super.png',
		amount: 1102.05,
	},
	{
		title: 'mega',
		src: '/img/jackpot-mega.png',
		amount: 108600,
	},
]

const extendedSlides = [...slides, slides[0]]

export default function JacpotsAmount() {
	const [currentIndex, setCurrentIndex] = useState(0)
	const [transition, setTransition] = useState(true)
	const intervalRef = useRef(null)

	useEffect(() => {
		intervalRef.current = setInterval(() => {
			setCurrentIndex(prev => prev + 1)
			setTransition(true)
		}, 5000)

		return () => clearInterval(intervalRef.current)
	}, [])

	useEffect(() => {
		if (currentIndex === extendedSlides.length - 1) {
			const timeout = setTimeout(() => {
				setTransition(false)
				setCurrentIndex(0)
			}, 500)
			return () => clearTimeout(timeout)
		}
	}, [currentIndex])

	return (
		<div className='roulette__jackpot-amount'>
			<div
				className='roulette__amount-list'
				style={{
					left: `-${currentIndex * 220}px`,
					transition: transition ? 'left 0.5s' : 'none',
				}}
			>
				{extendedSlides.map((item, index) => (
					<span className='roulette__amount-item' key={index}>
						$
						<NumberFlow
							value={item.amount}
							format={{
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							}}
						/>
					</span>
				))}
			</div>
		</div>
	)
}
