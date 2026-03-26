import { requets } from '@/shared/api/request'
import { API } from '@/shared/config/API'
import { useBetStore } from '../model'

export async function getUserWinsByEvent({ uid, eventId }) {
	const bets = useBetStore.getState().bets

	const activeBets = bets.filter(b => b.betAmount > 0)

	if (activeBets.length > 0) {
		return await requets(API.PATHS.GET_USER_WINS_BY_EVENT, {
			uuid: uid,
			event_id: eventId,
			ver_front: '0.0.0',
		})
	}
}