import React from 'react'
import './style'
import { AudioProvider } from './provider'
import { RoulettePage } from '@/views'
import useTimeInterval from '@/domain/time/model'

export default function App() {
	
	useTimeInterval()

	return (
		<AudioProvider>
			<RoulettePage></RoulettePage>
		</AudioProvider>
	)
}
