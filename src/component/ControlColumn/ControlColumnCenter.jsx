import React, { useEffect, useRef, useState } from 'react'
import SpinnerTimer from './SpinnerTimer'
import { wheelSlots } from '../WheelSlots'
import { getCellRandom } from '../../reducers/CreateRandomCell'
import gsap from 'gsap'
import { useRoulette } from '../../context/RouletteContext'

export default function ControlColumnCenter({ onSpinComplete, initialCell }) {
	const { state, dispatch } = useRoulette()
	const wheelRef = useRef(null)
	const progressRef = useRef(null)
	const targetCellRef = useRef(null)
	const pointerRef = useRef(null)
	const prevCellRef = useRef(null)
	const [cellRandom, setCellRandom] = useState(initialCell)
	const [currentCell, setCurrentCell] = useState(cellRandom.number)
	const [currentColor, setCurrentColor] = useState(cellRandom.color)
	const [winAmount, setWinAmount] = useState(0)
	const winRef = useRef(null)

	const getCellByRotation = rotation => {
		const normalized = ((rotation % 360) + 360) % 360

		let closestKey = null
		let minDiff = Infinity

		Object.keys(wheelSlots).forEach(k => {
			const slotAngle = wheelSlots[k].angle
			let diff = Math.abs(normalized - slotAngle)
			if (diff > 180) diff = 360 - diff

			if (diff < minDiff) {
				minDiff = diff
				closestKey = k
			}
		})

		if (closestKey === null) return null

		return {
			number: Number(closestKey),
			...wheelSlots[closestKey],
		}
	}

	const betsRef = useRef([])

	useEffect(() => {
		const wheel = wheelRef.current
		const path = progressRef.current
		gsap.set(wheel, { rotation: cellRandom.angle })

		function startTimer() {
			const length = path.getTotalLength()

			gsap.killTweensOf(path)
			gsap.set(path, {
				strokeDasharray: length,
				strokeDashoffset: 0,
				opacity: 1, // показываем линию при старте
			})

			gsap.to(path, {
				strokeDashoffset: length,
				duration: 2,
				ease: 'none',
				delay: 2,
				onComplete: () => {
					gsap.to(winRef.current, { opacity: 0, duration: 0.3 })
					gsap.set(path, { opacity: 0 })
					dispatch({ type: 'SAVE_ROUND' })
					dispatch({ type: 'SET_RESULT', payload: null })
					dispatch({ type: 'SET_ACTIVE', payload: false })
					SpinStart()
				},
			})
		}

		function SpinStart() {
			const currentRotation = gsap.getProperty(wheel, 'rotation')
			dispatch({ type: 'SET_ACTIVE', payload: false })
			gsap.to(wheel, {
				rotation: currentRotation + 360 * 2,
				duration: 3,
				ease: 'power1.in',
				onUpdate: () => {
					const rotation = gsap.getProperty(wheel, 'rotation') % 360
					const currentSlot = getCellByRotation(rotation)
					if (currentSlot) {
						if (currentSlot.number !== prevCellRef.current) {
							prevCellRef.current = currentSlot.number
							gsap.fromTo(
								pointerRef.current,
								{ rotation: 0 },
								{
									rotation: -15,
									duration: 0.1,
									ease: 'power1.out',
									yoyo: true,
									repeat: 1,
								},
							)
						}
						setCurrentCell(currentSlot.number)
						setCurrentColor(currentSlot.color)
					}
				},
				onComplete: SpinWait,
			})
		}

		function SpinWait() {
			const currentRotation = gsap.getProperty(wheel, 'rotation')
			const newCell = getCellRandom()
			targetCellRef.current = newCell
			setCellRandom(newCell)

			gsap.to(wheel, {
				rotation: currentRotation + 360 * 3,
				duration: 2,
				ease: 'linear',
				onUpdate: () => {
					const rotation = gsap.getProperty(wheel, 'rotation') % 360
					const currentSlot = getCellByRotation(rotation)
					if (currentSlot) {
						if (currentSlot.number !== prevCellRef.current) {
							prevCellRef.current = currentSlot.number
							gsap.fromTo(
								pointerRef.current,
								{ rotation: 0 },
								{
									rotation: -15,
									duration: 0.1,
									ease: 'power1.out',
									yoyo: true,
									repeat: 1,
								},
							)
						}
						setCurrentCell(currentSlot.number)
						setCurrentColor(currentSlot.color)
					}
				},
				onComplete: SpinToCell,
			})
		}

		function SpinToCell() {
			const target = targetCellRef.current
			const currentRotation = gsap.getProperty(wheel, 'rotation')

			const currentNormalized = ((currentRotation % 360) + 360) % 360
			let diff = target.angle - currentNormalized
			if (diff < 0) diff += 360

			gsap.to(wheel, {
				rotation: currentRotation + diff + 360 * 6,
				duration: 25,
				ease: 'power4.out',
				onUpdate: () => {
					const rotation = gsap.getProperty(wheel, 'rotation') % 360
					const currentSlot = getCellByRotation(rotation)
					if (currentSlot) {
						if (currentSlot.number !== prevCellRef.current) {
							prevCellRef.current = currentSlot.number
							gsap.fromTo(
								pointerRef.current,
								{ rotation: 0 },
								{
									rotation: -15,
									duration: 0.1,
									ease: 'power1.out',
									yoyo: true,
									repeat: 1,
								},
							)
						}
						setCurrentCell(currentSlot.number)
						setCurrentColor(currentSlot.color)
					}
				},
				onComplete: () => {
					setCurrentCell(target.number)
					setCurrentColor(target.color)
					onSpinComplete({ number: target.number, color: target.color })

					// считаем выигрыш локально для анимации
					const sector = wheelSlots[target.number].sector
					let totalWin = 0
					if (betsRef.current && betsRef.current.length > 0) {
						betsRef.current.forEach(bet => {
							if (bet.betAmount === 0) return
							let multiplier = 0
							switch (bet.type) {
								case 'number':
									if (bet.value === target.number) multiplier = 36
									break
								case 'color':
									if (target.color === bet.value && target.number !== 0)
										multiplier = 2
									break
								case 'parity':
									if (target.number !== 0) {
										if (bet.value === 'even' && target.number % 2 === 0)
											multiplier = 2
										if (bet.value === 'odd' && target.number % 2 !== 0)
											multiplier = 2
									}
									break
								case 'range':
									if (
										target.number !== 0 &&
										target.number >= bet.value[0] &&
										target.number <= bet.value[1]
									)
										multiplier = 2
									break
								case 'dozen':
									if (
										target.number !== 0 &&
										target.number >= bet.value[0] &&
										target.number <= bet.value[1]
									)
										multiplier = 3
									break
								case 'section':
									if (bet.value === sector) multiplier = 6
									break
							}
							totalWin += bet.betAmount * multiplier
						})
					}

					if (totalWin > 0) {
						setWinAmount(totalWin)
						gsap.fromTo(
							winRef.current,
							{ opacity: 0, scale: 0.5 },
							{ opacity: 1, scale: 1, duration: 0.5, ease: 'back.out' },
						)
					}

					dispatch({ type: 'SET_ACTIVE', payload: true })
					dispatch({
						type: 'SET_RESULT',
						payload: { number: target.number, color: target.color, sector },
					})
					dispatch({
						type: 'CALCULATE_WIN',
						payload: { number: target.number, color: target.color, sector },
					})
					dispatch({ type: 'SAVE_ROUND' })
					dispatch({ type: 'RESET_BETS' })
					startTimer()
				},
			})
		}

		startTimer()
	}, [])

	useEffect(() => {
		betsRef.current = state.bets
	}, [state.bets])

	return (
		<div className='roulette__control-center'>
			<div className='roulette__spinner-bg'>
				<div className='roulette__pointer' ref={pointerRef}></div>
				<div className='roulette__spinner-wheel' ref={wheelRef}></div>
				<div className={`roulette__spinner-num ${currentColor}`}>
					<div>{currentCell}</div>
				</div>
				<div className='roulette__winning' ref={winRef} style={{ opacity: 0 }}>
					<span>
						{winAmount > 0 && `${winAmount.toFixed(2).replace('.', ',')}`}
					</span>
				</div>
				<SpinnerTimer progressRef={progressRef} />
			</div>
		</div>
	)
}
