const baseURL = import.meta.env.VITE_BASE_API
const integrationURL = import.meta.env.VITE_WALLET_API

export const API = {
  PATHS:{
    CURRENT_DATA: baseURL + 'currentData/',
    GET_USER_BALANCE: integrationURL + 'getUserBalance/',
    MAKE_RECEIPT: integrationURL + 'makeReceipt/',
    GET_USER_WINS_BY_EVENT: integrationURL + 'getUserWinsByEvent/',
    GET_USER_BETS_HISTORY: integrationURL + 'getUserBetsHistory/',
  }
}