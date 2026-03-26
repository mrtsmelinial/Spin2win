export function getUrlParams() {
  const params = new URLSearchParams(window.location.search)
  const gameId = params.get('game_id')
  const uid = params.get('uid')
  const login = params.get('login')

  return { gameId, uid, login }

}