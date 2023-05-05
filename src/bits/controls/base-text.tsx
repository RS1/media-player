/* ┐
   │ File: base-text.tsx [/src/bits/controls/base-text.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 22nd, 2023 - 20:42:56
   │ Modified: May 4th, 2023 - 16:46:42
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import clsx from 'clsx'
import React from 'react'

import { useMediaConfig, useMediaTheme } from '@media/hooks'
import { MediaTrack } from '@media/types'

import { Entries } from '@utils/types'

export type BaseTextProps = {
    /**
     * The text to display.
     */
    text?: string
    /**
     * A map of text to display for each property of the track.
     * @example { artist: 'Artist', title: 'Title' }
     * Knowing what property corresponds to what text allows
     * the user to customize the styling of each property, via the theme or CSS.
     * Each property will be wrapped in a span with the id `${id}-${property}`,
     * and will be separated from the next property by a span with the id `${id}-${property}-separator`
     * with a content of either the `separator` prop or the `controlsMetadataSeparator` from the config.
     */
    textMap?: Partial<Record<keyof MediaTrack, string>>
    /**
     * The separator to use between properties.
     * If not specified, the `controlsMetadataSeparator` from the config will be used.
     * If that is not specified either, a dash will be used.
     */
    separator?: string
} & React.HTMLAttributes<HTMLSpanElement>

/**
 * A label showing text about the current track.\
 * It's not meant to be used directly, but rather extended by other components.\
 * The text can be specified via the `text` prop, or via the `textMap` prop.\
 * Won't be rendered if no text is provided.
 */
function BaseText(props: BaseTextProps, ref: React.Ref<HTMLSpanElement>) {
    const { text, textMap, separator, ...rest } = props
    const { controlsMetadataSeparator } = useMediaConfig()
    const theme = useMediaTheme()

    const sep = separator || controlsMetadataSeparator || ' - '

    if (!text && !textMap) return null

    return (
        <span {...rest} ref={ref} className={clsx('text-sm text-controls-color', rest.className)}>
            {text}
            {textMap &&
                (Object.entries(textMap) as Entries<Record<keyof MediaTrack, string>>)
                    .filter(([, value]) => value)
                    .map(([key, value], idx) => (
                        <React.Fragment key={key}>
                            {idx > 0 && <span id={`${rest.id}-${key}-separator`}>{sep}</span>}
                            <span id={`${rest.id}-${key}`} style={theme[key] ? { color: theme[key] } : undefined}>
                                {value}
                            </span>
                        </React.Fragment>
                    ))}
        </span>
    )
}

export default React.memo(React.forwardRef(BaseText))
