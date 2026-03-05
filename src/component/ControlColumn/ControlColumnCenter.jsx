import React, { useEffect, useRef, useState } from 'react'
import SpinnerTimer from './SpinnerTimer'
import { wheelSlots } from '../WheelSlots'
import gsap from 'gsap'
import {
	useRouletteSelector,
	useRouletteDispatch,
} from '../../context/useRoulette'
import { selectBets } from '../../selectors/rouletteSelectors'
import { useClickSound } from '../../context/AudioProvider'
import { useWheelAnimation } from '../../hooks/useWheelAnimation'
import { getColorImgSrc } from '../../utils/wheelUtils'
import { calculateWin } from '../../utils/сalculateWin'

export default function ControlColumnCenter({ onSpinComplete, initialCell }) {
	const dispatch = useRouletteDispatch()
	const bets = useRouletteSelector(selectBets)
	const wheelRef = useRef(null)
	const progressRef = useRef(null)
	const targetCellRef = useRef(null)
	const pointerRef = useRef(null)
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
		useWheelAnimation({
			wheelRef,
			progressRef,
			playSoundRef,
			pointerRef,
			initialAngle: initialCell.angle,
			onSlotChange: slot => {
				setCurrentCell(slot.number)
				setCurrentColorSrc(getColorImgSrc(slot.color))
			},
			setCellRandom,
			targetCellRef,
		})

	const betsRef = useRef([])

	useEffect(() => {
		init()

		const onTimerEnd = () => {
			dispatch({ type: 'SAVE_ROUND' })
			dispatch({ type: 'SET_ACTIVE', payload: false })

			SpinStart(() => {
				SpinWait(() => {
					SpinToCell(target => {
						const sector = wheelSlots[target.number].sector

						setCurrentCell(target.number)
						setCurrentColorSrc(getColorImgSrc(target.color))
						onSpinComplete({ number: target.number, color: target.color })

						const { totalWin } = calculateWin(
							betsRef.current,
							target,
							wheelSlots,
						)
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
			<img
				className='roulette__pointer'
				src='/img/roulette-pointer.svg'
				ref={pointerRef}
			/>
			<img className='roulette__spinner-cell' src={currentColorSrc} />

			<div className='roulette__spinner-num'>{currentCell}</div>
			<div className='roulette__winning' ref={winRef} style={{ opacity: 0 }}>
				<img className='roulette__winning-img' src='/img/reward-coins.svg' />
				<div className='roulette__winning-amount'>
					{winAmount > 0 && `${winAmount.toFixed(2).replace('.', ',')}`}
				</div>
			</div>
		</div>
	)
}
