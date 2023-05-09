/* ┐
   │ File: item-playlist.tsx [/src/bits/controls/item-playlist.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: May 3rd, 2023 - 9:23:06
   │ Modified: May 9th, 2023 - 14:25:28
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import clsx from 'clsx'
import React, { useCallback, useMemo } from 'react'

import { useMediaTheme, usePlaylist, useTrack, usePlayerMode, useMediaElement } from '@/media'

import useClickAway from '@hooks/use-click-away'

import { colorStringToRGBA } from '@utils/color'

import svgPlaylist from '@icons/playlist.svg'

import ControlButton from './base-button'
import BaseTag from './base-tag'
import { CustomControlProps } from './types'

type DropdownRect = {
    bottom: number
    left: number
    width: number
    height: number
    origin: 'left' | 'right'
    small: boolean
    open: boolean
}

/**
 * A button that opens a dropdown menu with the playlist.\
 * Won't be rendered if the playlist is empty.
 */
export default function Playlist(props: CustomControlProps) {
    const buttonRef = React.useRef<HTMLButtonElement>(null)
    const dropdownRef = React.useRef<HTMLDivElement>(null)
    const { container } = useMediaElement()
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
            width: dropdownRect === false ? 0 : dropdownRect.small ? dropdownRect.width : 'max-content',
            maxWidth: dropdownRect === false ? 0 : dropdownRect.width,
            maxHeight: dropdownRect === false ? 0 : dropdownRect.height,
        }
    }, [controlsBg, JSON.stringify(dropdownRect)])

    const toggleDropdown = useCallback(
        (open?: boolean | React.MouseEvent) => {
            const _open = typeof open === 'boolean' ? open : undefined
            function updateDropwdonwRect(): Omit<DropdownRect, 'open'> {
                const base: Omit<DropdownRect, 'open'> = {
                    bottom: 0,
                    left: 0,
                    width: 256,
                    height: 384,
                    origin: 'left',
                    small: false,
                }

                if (!buttonRef.current) return base
                const buttonRect = buttonRef.current.getBoundingClientRect()
                const playerRect = container?.getBoundingClientRect()
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

                const isSmall = width < base.width
                if (isSmall) {
                    width = playerRect.width - 32
                    left = playerRect.left - buttonRect.left + 16
                }
                // const top = isMiniPlayer ? playerRect.top - buttonRect.top + 16 : 0 - height - 12

                const origin = isButtonLeft ? 'left' : 'right'

                return {
                    bottom,
                    left,
                    width,
                    height,
                    origin,
                    small: isSmall,
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
        [isMiniPlayer, container],
    )

    const closeDropdown = useCallback(() => toggleDropdown(false), [toggleDropdown])

    useClickAway(dropdownRef, closeDropdown)

    if (!playlist || playlist.tracks.length <= 1) return null

    return (
        <div
            {...props}
            ref={dropdownRef}
            id='rmp-controls-playlist-group'
            className={clsx('relative w-auto h-auto flex', props.className)}
        >
            <ControlButton
                ref={buttonRef}
                id='rmp-controls-playlist'
                controlKey='playlist'
                size='sm'
                aria-label='Choose a track from the playlist'
                icon={svgPlaylist}
                onClick={toggleDropdown}
                active={dropdownRect !== false && dropdownRect.open}
            />
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
                aria-expanded={dropdownRect !== false && dropdownRect.open}
                aria-labelledby='rmp-controls-playlist'
                style={bgStyle}
            >
                {playlist.tracks.map(t => (
                    <li key={t.id} style={dividerStyle} className={clsx(track?.id === t.id && 'bg-controls-bg')}>
                        <button
                            className='flex items-start justify-start w-full py-2 px-4 text-left'
                            onClick={() => {
                                setTrack(t)
                                toggleDropdown(false)
                            }}
                        >
                            <BaseTag
                                controlKey='position'
                                className={clsx(track?.id !== t.id && 'opacity-50', 'mt-1 mr-2')}
                                text={`${track?.prefix || ''}${track?.position || ''}${track?.suffix || ''}`}
                            />
                            <span className={clsx(track?.id === t.id && 'font-bold', 'text-sm')}>
                                {t.title}
                                <span className='block text-xs opacity-50 font-normal'>{t.artist}</span>
                            </span>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}
