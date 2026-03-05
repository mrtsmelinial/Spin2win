import { createInitialBets } from './CreatingInitialBets.jsx'

export const initialState = {
	bets: createInitialBets(),
	history: [],
	savedRounds: [],
	balance: 10000,
	betting: true,
	rebetUsed: false,
	lastResult: null,
}
