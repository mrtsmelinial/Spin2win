import { useEffect, useRef } from 'react'
import { getUrlParams } from '@/shared/lib'
import { getUserBalance } from '../api/getUserBalance'
import { setBalance } from './store'
import { setError, useDrawStore } from '@/domain/draw/model/store/store'

const POLLING_INTERVAL = 10000

export function useBalancePolling() {
	const abortControllerRef = useRef(null)
	const timerRef = useRef(null)

	async function fetchBalance() {
		abortControllerRef.current?.abort()
		abortControllerRef.current = new AbortController()

		try {
			const { uid } = getUrlParams()
			const data = await getUserBalance(
				{ uuid: uid, ver_front: '0.0.0' },
				abortControllerRef.current.signal,
			)

			if (data.status === 'OK') {
				setBalance(parseFloat(data.balance))
			}
		} catch (err) {
			if (err.name === 'AbortError') return
			setError()
		}
	}

	function startPolling() {
		if (timerRef.current) return
		fetchBalance()
		timerRef.current = setInterval(fetchBalance, POLLING_INTERVAL)
	}

	function stopPolling() {
		clearInterval(timerRef.current)
		timerRef.current = null
		abortControllerRef.current?.abort()
		abortControllerRef.current = null
	}

	useEffect(() => {
		const unsubscribe = useDrawStore.subscribe(
			state => state.phase,
			phase => {
				if (phase === 'PLACE_BETS') startPolling()
				else stopPolling()
			},
			{ fireImmediately: true },
		)

		return () => {
			unsubscribe()
			stopPolling()
		}
	}, [])
}
