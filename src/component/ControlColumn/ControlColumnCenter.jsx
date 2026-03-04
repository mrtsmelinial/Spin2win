import React, { useEffect, useRef, useState } from 'react'
import SpinnerTimer from './SpinnerTimer'
import { wheelSlots } from '../WheelSlots'
import { getCellRandom } from '../../reducers/CreateRandomCell'
import gsap from 'gsap'
import { useRoulette } from '../../context/RouletteContext'
import { useClickSound } from '../../context/AudioProvider'

const colorSrcMap = {
	red: '/img/roulette-num-red-center.svg',
	black: '/img/roulette-num-black-center.svg',
	green: '/img/roulette-num-green-center.svg',
}

const getColorImgSrc = color => colorSrcMap[color] ?? null

export default function ControlColumnCenter({ onSpinComplete, initialCell }) {
	const { state, dispatch } = useRoulette()
	const wheelRef = useRef(null)
	const progressRef = useRef(null)
	const targetCellRef = useRef(null)
	const pointerRef = useRef(null)
	const prevCellRef = useRef(null)
	const [cellRandom, setCellRandom] = useState(initialCell)
	const [currentCell, setCurrentCell] = useState(cellRandom.number)
	const [currentColorSrc, setCurrentColorSrc] = useState(
		getColorImgSrc(initialCell.color),
	)
	const [winAmount, setWinAmount] = useState(0)
	const winRef = useRef(null)
	const { playSound } = useClickSound()
	const playSoundRef = useRef(playSound)

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
				opacity: 1,
			})

			gsap.to(path, {
				strokeDashoffset: length,
				duration: 10,
				ease: 'none',
				delay: 2,
				onComplete: () => {
					gsap.set(path, { opacity: 0 })
					dispatch({ type: 'SAVE_ROUND' })
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
							playSoundRef.current('click')
							gsap.fromTo(
								pointerRef.current,
								{ rotation: 0 },
								{
									rotation: -40,
									duration: 0.1,
									ease: 'power1.out',
									yoyo: true,
									repeat: 1,
								},
							)
						}
						setCurrentCell(currentSlot.number)
						setCurrentColorSrc(getColorImgSrc(currentSlot.color))
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
							playSoundRef.current('click')
							gsap.fromTo(
								pointerRef.current,
								{ rotation: 0 },
								{
									rotation: -40,
									duration: 0.1,
									ease: 'power1.out',
									yoyo: true,
									repeat: 1,
								},
							)
						}
						setCurrentCell(currentSlot.number)
						setCurrentColorSrc(getColorImgSrc(currentSlot.color))
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
				snap: { rotation: 0.1 },

				onUpdate: function () {
					const currentRot = gsap.getProperty(wheel, 'rotation')
					const targetRot = currentRotation + diff + 360 * 6
					if (
						this.progress() > 0.85 &&
						Math.abs(currentRot - targetRot) < 0.5
					) {
						this.progress(1)
					}

					const rotation = gsap.getProperty(wheel, 'rotation') % 360
					const currentSlot = getCellByRotation(rotation)
					if (currentSlot) {
						if (currentSlot.number !== prevCellRef.current) {
							prevCellRef.current = currentSlot.number
							playSoundRef.current('click')
							gsap.fromTo(
								pointerRef.current,
								{ rotation: 0 },
								{
									rotation: -40,
									duration: 0.1,
									ease: 'power1.out',
									yoyo: true,
									repeat: 1,
								},
							)
						}
						setCurrentCell(currentSlot.number)
						setCurrentColorSrc(getColorImgSrc(currentSlot.color))
					}
				},
				onComplete: () => {
					setCurrentCell(target.number)
					setCurrentColorSrc(getColorImgSrc(target.color))

					onSpinComplete({ number: target.number, color: target.color })

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
					dispatch({ type: 'RESET_BETS' })
					gsap.delayedCall(5, () => {
						dispatch({ type: 'SET_RESULT', payload: null })
						gsap.to(winRef.current, { opacity: 0, duration: 0.3 })
						dispatch({ type: 'SET_ACTIVE', payload: true })
						startTimer()
					})
				},
			})
		}
		startTimer()
	}, [])

	useEffect(() => {
		betsRef.current = state.bets
	}, [state.bets])

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
