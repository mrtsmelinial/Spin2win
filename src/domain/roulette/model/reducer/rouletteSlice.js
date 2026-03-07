import { createAction, createSlice } from '@reduxjs/toolkit'

export const setActive = createAction('roulette/setActive')
export const spinComplete = createAction('roulette/spinComplete')
export const spinReset = createAction('roulette/spinReset')

export const rouletteSlice = initialCell =>
	createSlice({
		name: 'roulette',
		initialState: { betting: true, lastResult: null, initialCell },
		reducers: {},
		extraReducers: builder => {
			builder
				.addCase(setActive, (state, action) => {
					state.betting = action.payload
				})
				.addCase(spinComplete, (state, action) => {
					state.lastResult = action.payload
				})
				.addCase(spinReset, state => {
					state.lastResult = null
					state.betting = true
				})
		},
	}).reducer