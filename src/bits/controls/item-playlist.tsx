/* ┐
   │ File: item-playlist.tsx [/src/bits/controls/item-playlist.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: May 3rd, 2023 - 9:23:06
   │ Modified: May 6th, 2023 - 14:58:18
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import clsx from 'clsx'
import React, { useCallback, useMemo } from 'react'

import { useMediaTheme, usePlaylist, useTrack, usePlayerMode } from '@/media'

import { colorStringToRGBA } from '@utils/color'

import svgPlaylist from '@icons/playlist.svg'

import ControlButton from './base-button'

type DropdownRect = {
    bottom: number
    left: number
    width: number
    height: number
    origin: 'left' | 'right'
    open: boolean
}

/**
 * A button that opens a dropdown menu with the playlist.\
 * Won't be rendered if the playlist is empty.
 */
export default function Playlist() {
    const buttonRef = React.useRef<HTMLButtonElement>(null)
    const [dropdownRect, setDropdownRect] = React.useState<DropdownRect | false>(false)

    const [track, setTrack] = useTrack()
    const [playlist] = usePlaylist()
    const { controlsColor, controlsBg } = useMediaTheme()
    const playerMode = usePlayerMode()
    const isMiniPlayer = playerMode === 'artwork-mini' || playerMode === 'vinyl-mini' || playerMode === 'controls'

    const dividerStyle = useMemo(() => {
        const borderColor = colorStringToRGBA(controlsColor, controlsColor)
        return {
            borderColor:
                typeof borderColor === 'string'
                    ? borderColor
                    : `rgba(${borderColor.r}, ${borderColor.g}, ${borderColor.b}, 0.25)`,
        }
    }, [controlsColor])

    const bgStyle = useMemo(() => {
        const bgColor = colorStringToRGBA(controlsBg, controlsBg)
        return {
            backgroundColor:
                typeof bgColor === 'string' ? bgColor : `rgba(${bgColor.r}, ${bgColor.g}, ${bgColor.b}, 0.9)`,
            bottom: dropdownRect === false ? 0 : dropdownRect.bottom,
            left: dropdownRect === false ? 0 : dropdownRect.left,
            width: dropdownRect === false ? 0 : 'max-content',
            maxWidth: dropdownRect === false ? 0 : dropdownRect.width,
            maxHeight: dropdownRect === false ? 0 : dropdownRect.height,
        }
    }, [controlsBg, JSON.stringify(dropdownRect)])

    const toggleDropdown = useCallback(
        (open?: boolean | React.MouseEvent) => {
            const _open = typeof open === 'boolean' ? open : undefined
            function updateDropwdonwRect(): Omit<DropdownRect, 'open'> {
                const base: Omit<DropdownRect, 'open'> = { bottom: 0, left: 0, width: 196, height: 384, origin: 'left' }

                if (!buttonRef.current) return base
                const buttonRect = buttonRef.current.getBoundingClientRect()
                const playerRect = document.querySelector('#rmp-player')?.getBoundingClientRect()

                if (!playerRect) return base

                const isButtonLeft = buttonRect.left < playerRect.left + playerRect.width / 2
                const controlsHeight = playerRect.bottom - buttonRect.top

                let left,
                    bottom,
                    width,
                    height = 0
                if (isMiniPlayer) {
                    height = playerRect.height - 32
                    bottom = buttonRect.bottom - playerRect.bottom + 16
                    if (isButtonLeft) {
                        width = playerRect.right - buttonRect.right - 32
                        left = buttonRect.width + 16
                    } else {
                        width = buttonRect.left - playerRect.left - 32
                        left = -width - 16
                    }
                } else {
                    height = Math.min(base.height, playerRect.height - 64 - controlsHeight)
                    width = playerRect.width - (buttonRect.left - playerRect.left) * 2
                    left = isButtonLeft ? 0 : 0 - width
                    bottom = buttonRect.height + 12
                }
                // const top = isMiniPlayer ? playerRect.top - buttonRect.top + 16 : 0 - height - 12

                const origin = isButtonLeft ? 'left' : 'right'

                return {
                    bottom,
                    left,
                    width,
                    height,
                    origin,
                }
            }

            setDropdownRect(d => {
                if (_open === undefined)
                    return d === false || !d.open ? { ...updateDropwdonwRect(), open: true } : { ...d, open: false }
                return _open
                    ? { ...updateDropwdonwRect(), open: true }
                    : { ...(d || updateDropwdonwRect()), open: false }
            })
        },
        [isMiniPlayer],
    )

    if (!playlist || playlist.tracks.length <= 1) return null

    return (
        <div id='rmp-controls-playlist-group' className='relative w-auto h-auto flex'>
            <ul
                id='rmp-controls-playlist-dropdown'
                className={clsx(
                    'absolute backdrop-blur rounded-md shadow-lg z-10',
                    'overflow-x-hidden overflow-y-auto divide-y divide-controls-bg transition transform-gpu',
                    isMiniPlayer && {
                        'origin-left': dropdownRect && dropdownRect.origin === 'left',
                        'origin-right': dropdownRect && dropdownRect.origin === 'right',
                        'scale-x-0': dropdownRect === false || !dropdownRect.open,
                    },
                    !isMiniPlayer && {
                        'origin-bottom': true,
                        'scale-y-0': dropdownRect === false || !dropdownRect.open,
                    },
                    {
                        'opacity-0 pointer-events-none touch-events-none': dropdownRect === false || !dropdownRect.open,
                    },
                )}
                aria-hidden={dropdownRect === false || !dropdownRect.open}
                aria-labelledby='rmp-controls-playlist'
                style={bgStyle}
            >
                {playlist.tracks.map(t => (
                    <li key={t.id} style={dividerStyle}>
                        <button
                            className='flex flex-col items-stretch w-full py-2 px-4 text-left'
                            onClick={() => {
                                setTrack(t)
                                toggleDropdown(false)
                            }}
                        >
                            <span className={clsx('text-sm', track?.id === t.id && 'font-bold')}>{`${t.side ?? ''}${
                                t.position ?? t.index + 1
                            }. ${t.title}`}</span>
                            <span className='text-xs opacity-50'>{t.artist}</span>
                        </button>
                    </li>
                ))}
            </ul>
            <ControlButton
                ref={buttonRef}
                id='rmp-controls-playlist'
                controlKey='playlist'
                size='sm'
                aria-label='Choose a track from the playlist'
                icon={svgPlaylist}
                onClick={toggleDropdown}
            />
        </div>
    )
}
