/* ┐
   │ File: base-tag.tsx [/src/bits/controls/base-tag.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 22nd, 2023 - 20:42:56
   │ Modified: May 9th, 2023 - 10:26:23
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import clsx from 'clsx'
import React from 'react'

import { useMediaTheme } from '@media/hooks'

import { ControlKey } from './types'

export type BaseTagProps = {
    /**
     * The key of the control, used to determine if there's
     * a theme color to use for this particular element.
     */
    controlKey?: ControlKey
    /**
     * The text to display.
     */
    text?: string
} & React.HTMLAttributes<HTMLSpanElement>

/**
 * A label showing text about the current track in a tag-like format.\
 * It's not meant to be used directly, but rather extended by other components.\
 * The text can be specified via the `text` prop.\
 * Won't be rendered if no text is provided.
 */
function BaseTag(props: BaseTagProps, ref: React.Ref<HTMLSpanElement>) {
    const { controlKey, text, ...rest } = props
    const theme = useMediaTheme()
    const elColor = controlKey && theme[controlKey] ? theme[controlKey] : undefined

    const elStyle = React.useMemo(() => {
        if (!elColor) return rest.style

        return {
            ...(rest.style || {}),
            color: elColor,
        }
    }, [JSON.stringify(rest.style), elColor])

    if (!text) return null

    return (
        <span
            ref={ref}
            id='rmp-controls-metadata-position'
            className={clsx(
                // Colors
                'bg-controls-color text-controls-bg',
                // Size & padding
                'min-w-[0.75rem] h-3 py-[0.1rem] px-1',
                // Text
                'text-xxs leading-none text-center font-bold align-middle',
                // Appearance
                'inline-block rounded-sm',
                rest.className,
            )}
            style={elStyle}
        >
            {text}
        </span>
    )
}

export default React.memo(React.forwardRef(BaseTag))
