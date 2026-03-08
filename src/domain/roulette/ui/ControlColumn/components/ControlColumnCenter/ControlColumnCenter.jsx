import React, { useEffect, useRef, useState } from 'react'
import SpinnerTimer from './SpinnerTimer'
import { wheelSlots } from '@/shared/constants'
import gsap from 'gsap'
import { useClickSound } from '@/shared/model'
import { getColorImgSrc } from '@/domain/roulette/lib'
import { useDrawCycle } from '@/domain/roulette/model/useDrawCycle'
import {
	setActive,
	spinReset as spinRouletteReset,
	spinComplete as rouletteSpinComplete,
} from '@/domain/roulette/model/store'
import {
	spinComplete as betSpinComplete,
	spinReset as spinBetReset,
} from '@/domain/bet/model/store'
import { spinComplete as historySpinComplete } from '@/domain/history/model/store'
import { spinComplete as statisticSpinComplete } from '@/domain/statistic/model/store'
import { useRouletteStore } from '@/domain/roulette/model/store'

export default function ControlColumnCenter() {
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
		rouletteSpinComplete(cell)
		betSpinComplete(cell)
		historySpinComplete(cell)
		statisticSpinComplete(cell)
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
		<div className='roulette__control-center'>
			<SpinnerTimer progressRef={progressRef} />
			<img className='roulette__spinner-bg' src='/img/roulette-bg.svg' />
			<img
				className='roulette__spinner-wheel'
				src='/img/roulette-wheel.svg'
				ref={wheelRef}
			/>
			<div className='roulette__pointer' ref={pointerRef}>
				<img
					className='roulette__pointer-img'
					src='/img/roulette-pointer.svg'
				/>
			</div>
			<img
				className='roulette__spinner-cell'
				ref={cellImgRef}
				src={currentColorSrc}
			/>
			<div className='roulette__spinner-num' ref={cellNumRef}>
				{currentCell}
			</div>
		</div>
	)
}
