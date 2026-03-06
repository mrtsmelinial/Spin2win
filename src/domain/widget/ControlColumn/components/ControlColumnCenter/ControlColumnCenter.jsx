import React, { useEffect, useRef, useState } from 'react'
import SpinnerTimer from './SpinnerTimer'
import { wheelSlots } from '@/shared/lib'
import gsap from 'gsap'
import { useRouletteSelector, useRouletteDispatch } from '@/domain/hooks'
import { useClickSound } from '@/domain/hooks'
import { selectBets } from '@/domain/selectors'
import { getColorImgSrc } from '@/domain/utils'
import { сalculateWin } from '@/domain/reducers'
import { useDrawCycle } from './useDrawCycle'

export default function ControlColumnCenter({ onSpinComplete, initialCell }) {
	const dispatch = useRouletteDispatch()
	const bets = useRouletteSelector(selectBets)
	const wheelRef = useRef(null)
	const progressRef = useRef(null)
	const targetCellRef = useRef(null)
	const pointerRef = useRef(null)
	const cellNumRef = useRef(null)
	const cellImgRef = useRef(null)
	const [cellRandom, setCellRandom] = useState(initialCell)
	const [currentCell, setCurrentCell] = useState(cellRandom.number)
	const [currentColorSrc, setCurrentColorSrc] = useState(
		getColorImgSrc(initialCell.color),
	)
	const [winAmount, setWinAmount] = useState(0)
	const winRef = useRef(null)
	const { playSound } = useClickSound()
	const playSoundRef = useRef(playSound)
	const { init, startTimer, SpinStart, SpinWait, SpinToCell } =
		useDrawCycle({
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

	const betsRef = useRef([])

	useEffect(() => {
		const wheel = wheelRef.current
		const progress = progressRef.current
		const pointer = pointerRef.current
		const win = winRef.current

		init()

		const onTimerEnd = () => {
			dispatch({ type: 'SET_ACTIVE', payload: false })

			SpinStart(() => {
				SpinWait(() => {
					SpinToCell(target => {
						const sector = wheelSlots[target.number].sector

						setCurrentCell(target.number)
						setCurrentColorSrc(getColorImgSrc(target.color))
						onSpinComplete({ number: target.number, color: target.color })

						const { totalWin } = сalculateWin(betsRef.current, target)

						if (totalWin > 0) {
							setWinAmount(totalWin)
							gsap.fromTo(
								winRef.current,
								{ opacity: 0, scale: 0.5 },
								{ opacity: 1, scale: 1, duration: 0.5, ease: 'back.out' },
							)
							playSoundRef.current('win')
						}

						dispatch({
							type: 'SET_RESULT',
							payload: { number: target.number, color: target.color, sector },
						})
						dispatch({ type: 'SAVE_ROUND' })
						dispatch({
							type: 'CALCULATE_WIN',
							payload: { number: target.number, color: target.color, sector },
						})

						gsap.delayedCall(5, () => {
							gsap.to(winRef.current, { opacity: 0, duration: 0.3 })
							dispatch({ type: 'RESET_BETS' })
							dispatch({ type: 'SET_RESULT', payload: null })
							dispatch({ type: 'SET_ACTIVE', payload: true })
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
			gsap.killTweensOf(win)
		}
	}, [])

	useEffect(() => {
		betsRef.current = bets
	}, [bets])

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
			<div className='roulette__winning' ref={winRef} style={{ opacity: 0 }}>
				<img className='roulette__winning-img' src='/img/reward-coins.svg' />
				<div className='roulette__winning-amount'>
					{winAmount > 0 && `${winAmount.toFixed(2).replace('.', ',')}`}
				</div>
			</div>
		</div>
	)
}
