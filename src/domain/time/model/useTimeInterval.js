import React, { useEffect } from 'react'
import { tick } from './store'

export default function useTimeInterval() {
	useEffect(() => {
		const interval = setInterval(() => {
			tick()
		}, 1000)
		return () => {
			clearInterval(interval)
		}
	}, [])
}
