import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useClickSound } from '@/shared/model'
import { selectBalance } from '@/domain/bet/model/selectors'
import { selectLastResult } from '@/domain/roulette/model/selectors/rouletteSelectors'
import { useSelector } from 'react-redux'

export default function WinDisplay() {
	const balance = useSelector(selectBalance)
	const lastResult = useSelector(selectLastResult)
	const { playSound } = useClickSound()
	const [winAmount, setWinAmount] = useState(0)
	const winRef = useRef(null)
	const prevBalanceRef = useRef(balance)

	useEffect(() => {
		if (lastResult !== null) {
			const win = balance - prevBalanceRef.current
			if (win > 0) {
				setWinAmount(win)
				playSound('win')
				gsap.fromTo(
					winRef.current,
					{ opacity: 0 },
					{ opacity: 1,  duration: 0.5, ease: 'power1' },
				)
				gsap.delayedCall(5, () => {
					gsap.to(winRef.current, { opacity: 0, duration: 0.3 })
				})
			}
		} else {
			prevBalanceRef.current = balance
		}
	}, [lastResult, balance])

	return (
		<div className='roulette__winning' ref={winRef} style={{ opacity: 0 }}>
			<img className='roulette__winning-img' src='/img/reward-coins.svg' />
			<div className='roulette__winning-amount'>
				{winAmount > 0 && `${winAmount.toFixed(2).replace('.', ',')}`}
			</div>
		</div>
	)
}
