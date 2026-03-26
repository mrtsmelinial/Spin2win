import { requets } from '@/shared/api/request'
import { API } from '@/shared/config/API'
import { mapBetsToApi } from '../lib/mapBetsToApi'
import { useBetStore } from '../model'

export async function makeReceipt({ login, uid, gameId, eventId, signal }) {
	const bets = useBetStore.getState().bets

	const activeBets = bets.filter(b => b.betAmount > 0)

	if (activeBets.length > 0) {
		return await requets(
			API.PATHS.MAKE_RECEIPT,
			{
				type: 'makeReceipt',
				uuid: uid,
				user: login,
				game: gameId,
				num: 0,
				bets: mapBetsToApi(bets, eventId),
				ver_front: '0.0.0',
			},
			{
				signal,
				uid,
			},
		)
	}
}
