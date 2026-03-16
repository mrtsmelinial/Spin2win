import React, { useEffect } from 'react'
import { useDrawCycle } from './useDrawCycle'
import { setActive } from './store'
import gsap from 'gsap'
import { spinReset as spinRouletteReset } from '@/domain/roulette'
import { spinReset as spinBetReset } from '@/domain/bet'
import { spinComplete as roundSpinComplete } from '@/domain/round'

export default function useSpinCycle({
	refs,
	initialCell,
	onSpinComplete,
	onSlotChange,
}) {
	const { wheelRef, progressRef, pointerRef, playSoundRef } = {
		wheelRef: refs.wheel,
		progressRef: refs.progress,
		pointerRef: refs.pointer,
		playSoundRef: refs.playSoundRef,
	}

	const { init, startTimer, SpinStart, SpinWait, SpinToCell } = useDrawCycle({
		wheelRef,
		progressRef,
		playSoundRef,
		pointerRef,
		initialAngle: initialCell.angle,
		onSlotChange,
	})

	useEffect(() => {
		init()

		const onTimerEnd = () => {
			setActive(false)

			SpinStart(() => {
				SpinWait(() => {
					SpinToCell(target => {
						onSlotChange(target)
						onSpinComplete(target)

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
			gsap.killTweensOf(refs.wheel.current)
			gsap.killTweensOf(refs.progress.current)
			gsap.killTweensOf(refs.pointer.current)
		}
	}, [])
}
