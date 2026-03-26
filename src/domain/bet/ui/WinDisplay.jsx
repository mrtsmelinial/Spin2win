import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useClickSound } from '@/shared/model'
import { useBetStore } from '@/domain/bet'

export default function WinDisplay() {
	const lastWin = useBetStore(state => state.lastWin)
	const billInfo = useBetStore(state => state.billInfo)
	const precision = billInfo.precision
	const { playSound } = useClickSound()
	const winRef = useRef(null)

	useEffect(() => {
		if (lastWin <= 0) return

		playSound('win')
		gsap.killTweensOf(winRef.current)
		gsap.fromTo(
			winRef.current,
			{ opacity: 0 },
			{ opacity: 1, duration: 0.5, ease: 'power1' },
		)
		gsap.delayedCall(5, () => {
			gsap.to(winRef.current, { opacity: 0, duration: 0.3 })
		})
	}, [lastWin])

	return (
		<div className='win-display' ref={winRef} style={{ opacity: 0 }}>
			<img className='win-display__img' src='/img/reward-coins.svg' />
			<div className='win-display__amount'>
				{lastWin > 0 && `${lastWin.toFixed(precision).replace('.', ',')}`}
			</div>
		</div>
	)
}
