import React, { useEffect, useRef, useState } from 'react'
import NumberFlow from '@number-flow/react'
import { useJackpotStore } from '../model/store'

const JACKPOT_CONFIG = {
	BIG: { title: 'big', src: '/img/jackpot-big.png' },
	SUPER: { title: 'super', src: '/img/jackpot-super.png' },
	MEGA: { title: 'mega', src: '/img/jackpot-mega.png' },
}

const SLIDE_WIDTH = 214
const INTERVAL_SLIDE = 5000
const TRANSITION = 500


export default function JackpotSlider() {
	const jackpots = useJackpotStore(state => state.jackpots)
	const [currentIndex, setCurrentIndex] = useState(0)
	const [transition, setTransition] = useState(true)
	const intervalRef = useRef(null)

	const slides = Object.entries(jackpots).map(([key, data]) => ({
		title: JACKPOT_CONFIG[key]?.title ?? key.toLowerCase(),
		src: JACKPOT_CONFIG[key]?.src ?? '',
		amount: data.current_accumulation,
		symbol: data.currency_symbol,
		precision: data.precision,
	}))

	const extendedSlides = slides.length > 0 ? [...slides, slides[0]] : []

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
		<div className='jackpot-slider'>
			<div className='jackpot-slider__container'>
				<div className='jackpot-slider__list' style={slideStyle}>
					{extendedSlides.map((item, index) => (
						<div
							key={index}
							className={`jackpot-slider__item ${
								item.title === 'big' ? 'jackpot-slider__item--right' : ''
							}`}
						>
							<img src={item.src} alt={item.title} />
						</div>
					))}
				</div>
			</div>

			<div className='jackpot-slider__container'>
				<div className='jackpot-slider__list' style={slideStyle}>
					{extendedSlides.map((item, index) => (
						<span key={index} className='jackpot-slider__item'>
							{item.symbol}
							<NumberFlow
								value={item.amount}
								format={{
									minimumFractionDigits: item.precision,
									maximumFractionDigits: item.precision,
								}}
							/>
						</span>
					))}
				</div>
			</div>
		</div>
	)
}
