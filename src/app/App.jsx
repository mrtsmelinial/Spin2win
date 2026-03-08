import React from 'react'
import './style'
import { AudioProvider } from './provider'
import { RoulettePage } from '@/views'

export default function App() {
	return (
			<AudioProvider>
				<RoulettePage>
				</RoulettePage>
			</AudioProvider>
	)
}
