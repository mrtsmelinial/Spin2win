import { requets } from '@/shared/api/request'
import { API } from '@/shared/config/API'

export async function getUserBetsHistory({ uid }) {
	return await requets(API.PATHS.GET_USER_BETS_HISTORY, {
		uuid: uid,
		ver_front: '0.0.0',
	})
}
