import { useRef } from 'react'

import { useAdaptiveScale } from '../../shared/hooks'

interface FrameProps extends React.ComponentPropsWithoutRef<'div'> {
	children?: React.ReactNode
	width?: number
	height?: number
}

export default function AdaptiveFrame(props: FrameProps) {
	const {
		children,
		className,
		width = 1920,
		height = 1080,
		style,
		...rest
	} = props

	const targetRef = useRef<HTMLDivElement>(null)
	useAdaptiveScale({ targetRef, width, height })

	return (
		<div className={className} style={{ transformOrigin: 'top left' }}>
			<div
				ref={targetRef}
				className='relative overflow-hidden'
				style={{ width, height, ...style }}
				{...rest}
			>
				{children}
			</div>
		</div>
	)
}
