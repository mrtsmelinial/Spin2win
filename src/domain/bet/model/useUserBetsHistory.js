import { getUrlParams } from '@/shared/lib'
import { setError } from '@/domain/draw'
import { RED_NUMBERS } from '@/shared/constants'
import { addRound, handleReady } from './store/myBetsStore'
import { getUserBetsHistory } from '../api/getUserBetsHistory'

const colorResult = number => {
	if (number === 0) return 'green'
	if (RED_NUMBERS.has(number)) return 'red'
	return 'black'
}

const getBetStatus = amount => {
	if (amount > 0) return 'Win'
	else return 'Lost'
}

export function useUserBetsHistory() {
	const { uid } = getUrlParams()

	const mapUserBetsHistory = data => {
		const mapped = data.map(event => ({
			id: event.event_id,
			date: event.event_date,
			round: event.event_public_id,
			result: {
				number: Number(event.result),
				color: colorResult(Number(event.result)),
			},
			bets: event.receipts[0].bet?.length ?? 0,
			amount: parseFloat(event.receipt_sum),
			win: parseFloat(event.receipt_sum_win),
			details: event.receipts[0].receipt_bets_obj.map(betObj => ({
				id: event.receipts[0].receipt_id,
				status: getBetStatus(betObj.win_amount),
				combination: betObj.bet_name,
				amount: parseFloat(betObj.bets_sum),
				odds: parseFloat(betObj.coef),
				win: parseFloat(betObj.win_amount),
			})),
		}))
		return mapped
	}

	async function fetchUserBetsHistory() {
		try {
			const data = await getUserBetsHistory({ uid })
			if (!data) {
				setError()
				return
			}
      handleReady(true)
			addRound(mapUserBetsHistory(data))
		} catch (error) {
			console.error('Error fetching user bets history:', error)
			throw error
		}
	}
	return { fetchUserBetsHistory }
}
