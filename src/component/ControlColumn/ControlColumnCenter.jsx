import React, { useEffect, useRef, useState } from 'react'
import SpinnerTimer from './SpinnerTimer'
import { wheelSlots } from '../WheelSlots'
import { getCellRandom } from '../../reducers/CreateRandomCell'
import gsap from 'gsap'

export default function ControlColumnCenter({ onSpinComplete, initialCell }) {
	const wheelRef = useRef(null)
	const progressRef = useRef(null)
	const targetCellRef = useRef(null)
const pointerRef = useRef(null)
const prevCellRef = useRef(null)


	const [cellRandom, setCellRandom] = useState(initialCell)
	const [currentCell, setCurrentCell] = useState(cellRandom.number)
	const [currentColor, setCurrentColor] = useState(cellRandom.color)

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
					gsap.set(path, { opacity: 0 }) // скрываем точку
					SpinStart()
				},
			})
		}

		function SpinStart() {
			const currentRotation = gsap.getProperty(wheel, 'rotation')

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
					startTimer()
					onSpinComplete({ number: target.number, color: target.color })
				},
			})
		}

		startTimer()
	}, [])

	return (
		<div className='roulette__control-center'>
			<div className='roulette__spinner-bg'>
				<div className='roulette__pointer' ref={pointerRef}></div>
				<div className='roulette__spinner-wheel' ref={wheelRef}></div>
				<div className={`roulette__spinner-num ${currentColor}`}>
					<div>{currentCell}</div>
				</div>
				<SpinnerTimer progressRef={progressRef} />
			</div>
		</div>
	)
}
