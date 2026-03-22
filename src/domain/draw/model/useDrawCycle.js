import React, { useEffect } from 'react'
import { useWheelAnimation } from '@/domain/roulette'
import { setActive, setResultCell } from '../../roulette/model/store'
import gsap from 'gsap'
import { spinReset as spinRouletteReset } from '@/domain/roulette'
import { spinReset as spinBetReset } from '@/domain/bet'
import { setRoundData } from '@/domain/round'
import { useCurrentData } from './useCurrentData'
import { setError, setTime, useDrawStore } from './store/store'
import { DRAW_TIME_SHIFT } from '../config/drawTimeShift'
import { getUrlParams } from '@/shared/lib'
import { getCurrentData } from '../api/getCurrentData'
import { wheelSlots } from '@/shared/constants'
import { setLastEvents } from '@/domain/history'
import { setStatistic } from '@/domain/statistic'
import { setJackpots } from '@/domain/jackpot'

const RETRY_DELAY = 1000
const MAX_RETRIES = 15

export default function useDrawCycle({
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

	const { fetchCurrentData } = useCurrentData()

	const { init, startTimer, SpinStart, SpinWait, SpinToCell } =
		useWheelAnimation({
			wheelRef,
			progressRef,
			playSoundRef,
			pointerRef,
			initialAngle: initialCell.angle,
			onSlotChange,
			onWaitTimeout: () => {
				setError(true)
			},
		})

	async function pollResult(retries = 0) {
		if (retries >= MAX_RETRIES) {
			setError()
			throw new Error('Max retries exceeded')
		}

		const { uid, gameId } = getUrlParams()
		const data = await getCurrentData({ uid, gameId })
		console.log('результат спина от сервера:', data)

		if (data.result === '99' || data.result === 99) {
			await new Promise(resolve => setTimeout(resolve, RETRY_DELAY))
			return pollResult(retries + 1)
		}

		return data
	}

	useEffect(() => {
		init()

		const onTimerEnd = () => {
			setActive(false)

			SpinStart(() => {
				const target = {}

				SpinWait(target, () => {
					SpinToCell(cell => {
						onSlotChange(cell)
						onSpinComplete(cell)

						const serverData = target.serverData
						if (serverData) {
							setLastEvents(serverData)
							setStatistic(serverData)
						}

						gsap.delayedCall(5, () => {
							if (serverData) {
								setTime(serverData)
								setRoundData(serverData)
								setJackpots(serverData)
							}

							spinBetReset()
							spinRouletteReset()

							const time = useDrawStore.getState().time
							startTimer(onTimerEnd, time - DRAW_TIME_SHIFT)
						})
					})
				})

				pollResult()
					.then(data => {
						setResultCell(data.result)

						const cell = {
							number: Number(data.result),
							...wheelSlots[data.result],
						}

						target.resolve?.(cell)
						target.serverData = data
					})
					.catch(err => {
						console.error('pollResult error:', err)
					})
			})
		}

		const start = async () => {
			await fetchCurrentData()
			const time = useDrawStore.getState().time

			if (time <= DRAW_TIME_SHIFT) {
				onTimerEnd()
			} else {
				startTimer(onTimerEnd, time - DRAW_TIME_SHIFT)
			}
		}

		start()

		return () => {
			gsap.killTweensOf(refs.wheel.current)
			gsap.killTweensOf(refs.progress.current)
			gsap.killTweensOf(refs.pointer.current)
		}
	}, [])
}
