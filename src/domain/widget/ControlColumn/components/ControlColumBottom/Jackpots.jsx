import React, { useEffect, useRef, useState } from 'react'

const slides = [
	{
		title: 'big',
		src: '/img/jackpot-big.png',
		amount: 148,
	},
	{
		title: 'super',
		src: '/img/jackpot-super.png',
		amount: 1102,
	},
	{
		title: 'mega',
		src: '/img/jackpot-mega.png',
		amount: 10860,
	},
]

const extendedSlides = [...slides, slides[0]]

export default function Jackpots() {
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
		<div className='roulette__jackpot'>
			<div
				className='roulette__jackpot-list'
				style={{
					left: `-${currentIndex * 220}px`,
					transition: transition ? 'left 0.5s' : 'none',
				}}
			>
				{extendedSlides.map((item, index) => (
					<div
						className={`roulette__jackpot-item ${item.title === 'big' ? 'roulette__jackpot-item--right' : ''}`}
						key={index}
					>
						<img className='roulette__jackpot-img ' src={item.src} />
					</div>
				))}
			</div>
		</div>
	)
}
