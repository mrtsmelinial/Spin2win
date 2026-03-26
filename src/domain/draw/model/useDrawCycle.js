import React, { useEffect } from 'react'
import gsap from 'gsap'
import { handlePases, setError, setTime, useDrawStore } from '@/domain/draw'
import { useWheelAnimation } from '@/domain/roulette'
import { DRAW_TIME_SHIFT } from '../config/drawTimeShift'
import { wheelSlots } from '@/shared/constants'
import { setRoundData } from '@/domain/round'
import { setLastEvents } from '@/domain/history'
import { setStatistic } from '@/domain/statistic'
import { setJackpots } from '@/domain/jackpot'
import { useCurrentData } from './useCurrentData'
import { betReset, setLastWins } from '@/domain/bet'
import { useReceipt } from '@/domain/bet/model/useMakeReceipt'
import { setBalance } from '@/domain/balance'

export default function useDrawCycle({ refs, result, onSlotChange }) {
	const { pollResult } = useCurrentData()
	const { sendReceipt, resetReceipt, balanceRef } = useReceipt()

	const { wheelRef, progressRef, pointerRef, playSoundRef } = {
		wheelRef: refs.wheel,
		progressRef: refs.progress,
		pointerRef: refs.pointer,
		playSoundRef: refs.playSoundRef,
	}

	const { init, startTimer, SpinStart, SpinWait, SpinToCell } =
		useWheelAnimation({
			wheelRef,
			progressRef,
			playSoundRef,
			pointerRef,
			initialAngle: result.angle,
			onSlotChange,
			onWaitTimeout: () => {
				setError()
			},
		})

	useEffect(() => {
		init()

		const onTimerEnd = () => {
			handlePases('draw')

			SpinStart(() => {
				const target = {}

				SpinWait(target, () => {
					SpinToCell(cell => {
						onSlotChange(cell)

						const serverData = target.serverData
						const wins = target.wins
						if (serverData) {
							setLastEvents(serverData)
							setStatistic(serverData)
							useDrawStore.getState().setResultCell(serverData)
						}

						if (balanceRef.current !== null) {
							setBalance(balanceRef.current)
						}

						if (wins) {
							setLastWins(wins)
						}

						handlePases('winners')

						gsap.delayedCall(5, () => {
							if (serverData) {
								setTime(serverData)
								setRoundData(serverData)
								setJackpots(serverData)
							}
							betReset()
							handlePases('place_bets')
							const time = useDrawStore.getState().time
							startTimer(onTimerEnd, time - DRAW_TIME_SHIFT)
						})
					})
				})

				pollResult()
					.then(({ data, wins }) => {
						const cell = {
							number: Number(data.result),
							...wheelSlots[data.result],
						}

						target.resolve?.(cell)
						target.serverData = data
						target.wins = wins
					})
					.catch(() => {
						setError()
					})
			})
		}

		const start = async () => {
			resetReceipt()
			sendReceipt()

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
			resetReceipt()
		}
	}, [])
}
