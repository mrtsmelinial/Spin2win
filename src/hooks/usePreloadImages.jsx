import { useEffect } from 'react'

export function usePreloadImages(images) {
	useEffect(() => {
		images.forEach(src => {
			const img = new Image()
			img.src = src
		})
	}, [])
}
