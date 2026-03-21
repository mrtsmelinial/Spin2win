import { requets } from "@/shared/api/request"
import { API } from "@/shared/config/API"

export async function getCurrentData({gameId, uid}) {
  const body = {
		game_id: gameId,
		options: {
			off: ['rnd_num', 'bonus_multiplier', 'event_date_ts', 'event_date'],
			last_events: {
				cnt: 10,
				offset: 0,
			},
			bill_info: {
				min_bet: {},
				max_bet: {},
				button_list: {},
				precision: 0,
			},
		},
		ver_front: '0.0.0',
	}

  const data = await requets(API.PATHS.CURRENT_DATA, body, { apiKey: uid })
	return data
}