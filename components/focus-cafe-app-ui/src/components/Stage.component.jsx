import React from 'react'
import Timer from './Timer.component.jsx'

export default function Stage({
	item,
	focusDuration,
	breakDuration,
	numSessions,
}) {
	return (
		<Timer
			item={item}
			focusDuration={focusDuration}
			breakDuration={breakDuration}
			numSessions={numSessions}
		/>
	)
}