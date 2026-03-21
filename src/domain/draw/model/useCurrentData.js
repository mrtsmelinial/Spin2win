import { getUrlParams } from '@/shared/lib'
import { getCurrentData } from '../api/getCurrentData'
import { setTime } from './store/store'
import { setRoundData } from '@/domain/round'
import { setLastEvents } from '@/domain/history'
import { setStatistic } from '@/domain/statistic'
import { setJackpots } from '@/domain/jackpot'
import { setBillInfo } from '@/domain/bet'

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
		} catch (error) {
			console.error('Error fetching current data:', error)
		}
	}

	return { fetchCurrentData }
}
