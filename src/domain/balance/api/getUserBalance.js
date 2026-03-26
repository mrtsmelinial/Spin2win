import { requets } from '@/shared/api/request'
import { API } from '@/shared/config/API'

export async function getUserBalance({ uuid, ver_front }, signal) {
	return requets(API.PATHS.GET_USER_BALANCE, { uuid, ver_front }, { signal })
}
