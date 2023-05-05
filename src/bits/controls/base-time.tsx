/* ┐
   │ File: base-time.tsx [/src/bits/controls/base-time.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 21st, 2023 - 13:01:53
   │ Modified: May 4th, 2023 - 16:46:22
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import { clsx } from 'clsx'
import React from 'react'

import { useMediaTheme, useMediaTime } from '@/media'
import { MediaTimeState } from '@media/types'

import { timeToString } from '@utils/string'

export type BaseTimeProps = {
    type?: 'time' | 'duration' | 'remaining'
} & React.HTMLAttributes<HTMLSpanElement>

/**
 * For the given property, returns the corresponding
 * value from the state in a formatted way.
 * @param {Props['type']} property The property to get. (`time`, `duration` or `remaining`)
 * @param {MediaTimeState} state The state to get the property from.
 * @returns {string} The formatted value of the property. `` if the property isn't recognized.
 * @private
 * @example getPropertyFromState('time', { time: 12, duration: 20, [...] }) // '00:12'
 *          getPropertyFromState('duration', { time: 12, duration: 20, [...] }) // '00:20'
 *          getPropertyFromState('remaining', { time: 12, duration: 20, [...] }) // '-00:08'
 */
function getPropertyFromState(property: BaseTimeProps['type'], state: MediaTimeState) {
    switch (property) {
        case 'time':
            return timeToString(state.time)
        case 'duration':
            return timeToString(state.duration)
        case 'remaining':
            return `-${timeToString(state.duration - state.time)}`
        default:
            return ''
    }
}

/**
 * For the given property, we load the corresponding value from the state
 * and display it in a styled span element.\
 * It's not meant to be used directly, but rather extended by other components.\
 * If there is no `duration` in the state, we display `--:--`. This could happen
 * if the media hasn't loaded yet, if it's a live stream, or if the media failed to load.
 */
function BaseTime(props: BaseTimeProps, ref: React.Ref<HTMLSpanElement>) {
    const { type = 'time', ...rest } = props
    const timeState = useMediaTime()
    const theme = useMediaTheme()

    const text = !timeState.duration ? '--:--' : getPropertyFromState(type, timeState)

    const timeStyle = React.useMemo(() => {
        return {
            ...(rest.style || {}),
            color: theme[type],
        }
    }, [JSON.stringify(rest.style), JSON.stringify(theme), type])

    return (
        <span {...rest} ref={ref} className={clsx('text-sm font-mono shrink-0', rest.className)} style={timeStyle}>
            {text}
        </span>
    )
}

export default React.memo(React.forwardRef(BaseTime))
