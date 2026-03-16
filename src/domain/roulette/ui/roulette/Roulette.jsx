import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useClickSound } from '@/shared/model'
import { useRouletteStore } from '@/domain/roulette'
import { useSpinComplete } from '../../model/useSpinComplete'
import useSpinCycle from '../../model/useSpinCycle'
import { getColorImgSrc } from '../../lib'

export default function Roulette() {
	const initialCell = useRouletteStore(state => state.initialCell)
	const { playSound } = useClickSound()
	const wheelRef = useRef(null)
	const progressRef = useRef(null)
	const pointerRef = useRef(null)
	const playSoundRef = useRef(playSound)
	const [display, setDisplay] = useState({
		number: initialCell.number,
		colorSrc: getColorImgSrc(initialCell.color),
	})

	const refs = useMemo(
		() => ({
			wheel: wheelRef,
			progress: progressRef,
			pointer: pointerRef,
			playSoundRef,
		}),
		[],
	)

	const onSpinComplete = useSpinComplete()

	useSpinCycle({
		refs,
		initialCell,
		onSpinComplete,
		onSlotChange: slot =>
			setDisplay({
				number: slot.number,
				colorSrc: getColorImgSrc(slot.color),
			}),
	})

	useEffect(() => {
		playSoundRef.current = playSound
	}, [playSound])

	return (
		<div className='roulette'>
			<svg
				version='1.1'
				xmlns='http://www.w3.org/2000/svg'
				viewBox='0 0 712.7 712.7'
				className='roulette__timer'
			>
				<path
					className='load0-st1'
					d='M296.4,19.6C136.5,47.8,15,187.4,15,355.4c0,188.3,152.7,341,341,341s341-152.7,341-341
              c0-168-121.5-307.6-281.4-335.8'
				></path>
				<path
					className='load1-st0'
					ref={progressRef}
					d='M296.4,19.6C136.5,47.8,15,187.4,15,355.4c0,188.3,152.7,341,341,341s341-152.7,341-341
              c0-168-121.5-307.6-281.4-335.8'
				></path>
			</svg>
			<img className='roulette__bg' src='/img/roulette-bg.svg' />
			<img
				className='roulette__wheel'
				src='/img/roulette-wheel.svg'
				ref={wheelRef}
			/>
			<div className='roulette__pointer' ref={pointerRef}>
				<img
					className='roulette__pointer-img'
					src='/img/roulette-pointer.svg'
				/>
			</div>
			<img className='roulette__cells' src={display.colorSrc} />
			<div className='roulette__num'>{display.number}</div>
		</div>
	)
}
