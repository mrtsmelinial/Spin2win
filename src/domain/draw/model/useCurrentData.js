import { getUrlParams } from '@/shared/lib'
import { getCurrentData } from '../api/getCurrentData'
import { setError, setReady, setResultCell, setTime } from './store/store'
import { setRoundData } from '@/domain/round'
import { setLastEvents } from '@/domain/history'
import { setStatistic } from '@/domain/statistic'
import { setJackpots } from '@/domain/jackpot'
import { setBillInfo } from '@/domain/bet'
import { MAX_RETRIES, RETRY_DELAY } from '../config/spinConfig'
import { getUserWinsByEvent } from '@/domain/bet/api/getUserWinsByEvent'
import { useRoundStore } from '@/domain/round/model'

export function useCurrentData() {
	const { uid, gameId } = getUrlParams()

	async function fetchCurrentData() {
		try {
			const data = await getCurrentData({ uid, gameId })

			setTime(data)
			setRoundData(data)
			setLastEvents(data)
			setStatistic(data)
			setJackpots(data)
			setBillInfo(data)
			setResultCell(data)

			setReady(true)
		} catch {
			console.error('Failed to fetch current data')
		}
	}

	async function pollResult(retries = 0) {
		if (retries >= MAX_RETRIES) {
			setError()
			throw new Error('Max retries exceeded')
		}

		const eventId = useRoundStore.getState().nextPrivateRound

		const data = await getCurrentData({ uid, gameId })

		if (data.result === '99' || data.result === 99) {
			await new Promise(resolve => setTimeout(resolve, RETRY_DELAY))

			return pollResult(retries + 1)
		}


		const wins = await new Promise(resolve => {
			setTimeout(async () => {
				resolve(await getUserWinsByEvent({ uid, eventId }))
			}, 1000)
		})

		return { data, wins }
	}

	return { fetchCurrentData, pollResult }
}
