import React, { useEffect, useRef, useState } from 'react'
import { wheelSlots } from '@/shared/constants'
import gsap from 'gsap'
import { useClickSound } from '@/shared/model'
import { getColorImgSrc } from '@/domain/roulette/lib'
import { useDrawCycle } from '@/domain/roulette/model/useDrawCycle'
import {
	setActive,
	spinReset as spinRouletteReset,
	spinComplete as rouletteSpinComplete,
} from '@/domain/roulette'
import {
	spinComplete as betSpinComplete,
	spinReset as spinBetReset,
} from '@/domain/bet'
import { spinComplete as historySpinComplete } from '@/domain/history'
import { spinComplete as statisticSpinComplete } from '@/domain/statistic'
import { spinComplete as roundSpinComplete } from '@/domain/round'
import { spinComplete as myBetsSpinComplete } from '@/domain/mybets'
import { useRouletteStore } from '@/domain/roulette'

export default function Roulette() {
	const wheelRef = useRef(null)
	const progressRef = useRef(null)
	const targetCellRef = useRef(null)
	const pointerRef = useRef(null)
	const cellNumRef = useRef(null)
	const cellImgRef = useRef(null)
	const initialCell = useRouletteStore(state => state.initialCell)
	const [cellRandom, setCellRandom] = useState(initialCell)
	const [currentCell, setCurrentCell] = useState(cellRandom.number)
	const [currentColorSrc, setCurrentColorSrc] = useState(
		getColorImgSrc(initialCell.color),
	)
	const { playSound } = useClickSound()
	const playSoundRef = useRef(playSound)

	const spinComplete = cell => {
		betSpinComplete(cell)
		rouletteSpinComplete(cell)
		historySpinComplete(cell)
		statisticSpinComplete(cell)
		myBetsSpinComplete(cell)
	}

	const { init, startTimer, SpinStart, SpinWait, SpinToCell } = useDrawCycle({
		wheelRef,
		progressRef,
		playSoundRef,
		pointerRef,
		initialAngle: initialCell.angle,
		onSlotChange: slot => {
			if (cellNumRef.current) cellNumRef.current.textContent = slot.number
			if (cellImgRef.current)
				cellImgRef.current.src = getColorImgSrc(slot.color)
		},
		setCellRandom,
		targetCellRef,
	})

	useEffect(() => {
		const wheel = wheelRef.current
		const progress = progressRef.current
		const pointer = pointerRef.current

		init()

		const onTimerEnd = () => {
			setActive(false)

			SpinStart(() => {
				SpinWait(() => {
					SpinToCell(target => {
						const sector = wheelSlots[target.number].sector

						setCurrentCell(target.number)
						setCurrentColorSrc(getColorImgSrc(target.color))
						spinComplete({
							number: target.number,
							color: target.color,
							sector,
						}) 

						gsap.delayedCall(5, () => {
							spinBetReset()
							spinRouletteReset()
							roundSpinComplete()
							startTimer(onTimerEnd)
						})
					})
				})
			})
		}
		startTimer(onTimerEnd)

		return () => {
			gsap.killTweensOf(wheel)
			gsap.killTweensOf(progress)
			gsap.killTweensOf(pointer)
		}
	}, [])

	useEffect(() => {
		playSoundRef.current = playSound
	}, [playSound])

	return (
		<div className='roulette'>
			<svg
				progressRef={progressRef}
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
			<img className='roulette__cells' ref={cellImgRef} src={currentColorSrc} />
			<div className='roulette__num' ref={cellNumRef}>
				{currentCell}
			</div>
		</div>
	)
}
