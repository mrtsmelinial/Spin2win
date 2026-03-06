import React, { useEffect, useRef, useState } from 'react'
import NumberFlow from '@number-flow/react'

const slides = [
	{ title: 'big', src: '/img/jackpot-big.png', amount: 148.1 },
	{ title: 'super', src: '/img/jackpot-super.png', amount: 1102.05 },
	{ title: 'mega', src: '/img/jackpot-mega.png', amount: 108600 },
]

const SLIDE_WIDTH = 220
const INTERVAL_SLIDE = 5000
const TRANSITION = 500

const extendedSlides = [...slides, slides[0]]

export default function JackpotSlider() {
	const [currentIndex, setCurrentIndex] = useState(0)
	const [transition, setTransition] = useState(true)
	const intervalRef = useRef(null)

	useEffect(() => {
		intervalRef.current = setInterval(() => {
			setTransition(true)
			setCurrentIndex(prev => prev + 1)
		}, INTERVAL_SLIDE)

		return () => clearInterval(intervalRef.current)
	}, [])

	useEffect(() => {
		if (currentIndex !== extendedSlides.length - 1) return

		const timeout = setTimeout(() => {
			setTransition(false)
			setCurrentIndex(0)
		}, TRANSITION)

		return () => clearTimeout(timeout)
	}, [currentIndex])

	const offset = currentIndex * SLIDE_WIDTH
	const slideStyle = {
		left: `-${offset}px`,
		transition: transition ? `left ${TRANSITION}ms ease` : 'none',
	}

	return (
		<div className='roulette__jackpot-slider'>
			<div className='roulette__jackpot'>
				<div className='roulette__jackpot-list' style={slideStyle}>
					{extendedSlides.map((item, index) => (
						<div
							key={index}
							className={`roulette__jackpot-item ${
								item.title === 'big' ? 'roulette__jackpot-item--right' : ''
							}`}
						>
							<img
								className='roulette__jackpot-img'
								src={item.src}
								alt={item.title}
							/>
						</div>
					))}
				</div>
			</div>

			<div className='roulette__jackpot-amount'>
				<div className='roulette__amount-list' style={slideStyle}>
					{extendedSlides.map((item, index) => (
						<span key={index} className='roulette__amount-item'>
							$
							<NumberFlow
								value={item.amount}
								format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
							/>
						</span>
					))}
				</div>
			</div>
		</div>
	)
}
