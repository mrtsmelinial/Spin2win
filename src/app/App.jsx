import React from 'react'
import './style'
import { AudioProvider } from './provider'
import { RouletteProvider } from './provider'
import { RoulettePage } from '@/views'

export default function App() {
	return (
		<RouletteProvider>
			<AudioProvider>
				<RoulettePage>
				</RoulettePage>
			</AudioProvider>
		</RouletteProvider>
	)
}
