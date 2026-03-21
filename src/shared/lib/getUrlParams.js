export function getUrlParams() {
  const params = new URLSearchParams(window.location.search)
  const gameId = params.get('game_id')
  const uid = params.get('uid')

  return { gameId, uid }

}