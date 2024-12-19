'use client'
import { CallControls } from '@stream-io/video-react-sdk'

import { useStreamCall } from '@/hooks/useStreamCall'
import { PaginatedGridLayout, SpeakerLayout } from '@stream-io/video-react-sdk'
import { BetweenHorizontalEnd, BetweenVerticalEnd, LayoutGrid } from 'lucide-react'
import { useState } from 'react'
type CallLayout = 'speaker-vert' | 'speaker-horiz' | 'grid'

const FlexibleCallLayout = () => {
	const [layout, setLayout] = useState<CallLayout>('speaker-vert')
	const call = useStreamCall()
	return (
		<div className="space-y-3">
			<CallLayoutButtons layout={layout} setLayout={setLayout} />
			<CallLayoutView layout={layout} />
			<CallControls />
		</div>
	)
}
interface CallLayoutButtonsProps {
	layout: CallLayout
	setLayout: (layout: CallLayout) => void
}
const CallLayoutButtons = ({ layout, setLayout }: CallLayoutButtonsProps) => {
	return (
		<div className="mx-auto w-fit space-x-6">
			<button onClick={() => setLayout('speaker-vert')}>
				<BetweenVerticalEnd className={layout !== 'speaker-vert' ? 'text-gray-400' : ''} />
			</button>
			<button onClick={() => setLayout('speaker-horiz')}>
				<BetweenHorizontalEnd className={layout !== 'speaker-horiz' ? 'text-gray-400' : ''} />
			</button>
			<button onClick={() => setLayout('grid')}>
				<LayoutGrid className={layout !== 'grid' ? 'text-gray-400' : ''} />
			</button>
		</div>
	)
}

interface CallLayoutViewProps {
	layout: CallLayout
}

const CallLayoutView = ({ layout }: CallLayoutViewProps) => {
	if (layout === 'speaker-vert') {
		return <SpeakerLayout />
	}
	if (layout === 'speaker-horiz') {
		return <SpeakerLayout participantsBarPosition="right" />
	}
	if (layout === 'grid') {
		return <PaginatedGridLayout />
	}
	return null
}

export default FlexibleCallLayout
