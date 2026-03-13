import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useClickSound } from '@/shared/model'
import { useBetStore } from '@/domain/bet'

export default function WinDisplay() {
	const lastWin = useBetStore(state => state.lastWin)
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
		<div className='roulette__winning' ref={winRef} style={{ opacity: 0 }}>
			<img className='roulette__winning-img' src='/img/reward-coins.svg' />
			<div className='roulette__winning-amount'>
				{lastWin > 0 && `${lastWin.toFixed(2).replace('.', ',')}`}
			</div>
		</div>
	)
}
