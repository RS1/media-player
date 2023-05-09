/* ┐
   │ File: item-metadata.tsx [/src/bits/controls/item-metadata.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 28th, 2023 - 16:57:37
   │ Modified: May 9th, 2023 - 10:45:38
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import clsx from 'clsx'
import React from 'react'

import { useTrack, useMediaConfig } from '@/media'

import BaseTag from './base-tag'
import { CustomControlProps } from './types'

/**
 * A text label showing the current track's metadata (title, artist, album).\
 * The metadata will be separated with the `controlsMetadataSeparator` config value (default: ` — `).\
 * Won't be rendered if the track has no metadata.
 */
export default function Metadata(props: CustomControlProps) {
    const [track] = useTrack()
    const { controlsMetadataSeparator } = useMediaConfig()

    const meta = {
        position: `${track?.prefix || ''}${track?.position || ''}${track?.suffix || ''}`,
        title: track?.title,
        artist: track?.artist,
        album: track?.album,
    }

    const separator = controlsMetadataSeparator || ' — '

    if (!meta.title && !meta.artist && !meta.album) return null

    return (
        <span
            {...props}
            id='rmp-controls-metadata'
            className={clsx(
                'text-xs text-controls-color py-1',
                'max-w-full whitespace-nowrap overflow-hidden text-ellipsis',
                props.className,
            )}
        >
            {meta.position && (
                <BaseTag
                    id='rmp-controls-metadata-position'
                    controlKey='position'
                    className='opacity-50 mr-2'
                    text={meta.position}
                />
            )}
            {meta.title && (
                <span id='rmp-controls-metadata-title' className='font-bold align-middle'>
                    {meta.title}
                </span>
            )}
            {(meta.artist || meta.album) && (
                <span id='rmp-controls-metadata-group' className='opacity-50 align-middle'>
                    {meta.title && (meta.artist || meta.album) && (
                        <span className='rmp-controls-metadata-separator'>{separator}</span>
                    )}
                    {meta.artist && <span id='rmp-controls-metadata-artist'>{meta.artist}</span>}
                    {meta.artist && meta.album && <span className='rmp-controls-metadata-separator'>{separator}</span>}
                    {meta.album && <span id='rmp-controls-metadata-album'>{meta.album}</span>}
                </span>
            )}
        </span>
    )
}
