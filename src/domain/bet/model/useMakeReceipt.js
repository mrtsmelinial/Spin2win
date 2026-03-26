import { useRef, useCallback } from 'react'
import { makeReceipt } from '../api/makeReceipt'
import { getUrlParams, sleep } from '@/shared/lib'
import { useDrawStore } from '@/domain/draw'
import { useRoundStore } from '@/domain/round/model'
import { betReset } from './store'

export const RECEIPT_TIME_SHIFT = 6000

export function useReceipt() {
	const abortControllerRef = useRef(null)
	const isSentRef = useRef(false)
	const balanceRef = useRef(0)

	const resetReceipt = useCallback(() => {
		isSentRef.current = false
		balanceRef.current = null

		if (abortControllerRef.current) {
			abortControllerRef.current.abort()
			abortControllerRef.current = null
		}
	}, [])

	const sendReceipt = useCallback(async () => {
		const { uid, login, gameId } = getUrlParams()
		const time = useDrawStore.getState().time
		const eventId = useRoundStore.getState().nextPrivateRound

		const delay = time * 1000 - 3000

		if (delay < 0 || isSentRef.current) return

		await sleep(delay)

		if (isSentRef.current) return
		isSentRef.current = true

		abortControllerRef.current = new AbortController()

		const cancelTimeout = setTimeout(() => {
			abortControllerRef.current?.abort()
		}, RECEIPT_TIME_SHIFT)

		try {
			const data = await makeReceipt({
				login,
				uid,
				gameId,
				eventId,
				signal: abortControllerRef.current.signal,
			})

			if (!data) {
				betReset()
				return
			}


			if (data.ip_result === true) {
				if (data.balance !== undefined) {
					balanceRef.current = data.balance
				}
			}else {
        betReset()
      }
		} catch (error) {
			if (error.name === 'AbortError') {
				console.warn('makeReceipt: запрос отменён')
			} else {
				console.error('makeReceipt error:', error)
			}
		} finally {
			clearTimeout(cancelTimeout)
			abortControllerRef.current = null
		}
	}, [])

	return { sendReceipt, resetReceipt, balanceRef }
}
