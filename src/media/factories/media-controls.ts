/* ┐
   │ File: media-controls.ts [/src/media/factories/media-controls.ts]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 24th, 2023 - 10:20:52
   │ Modified: April 28th, 2023 - 22:12:44
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import { useMemo } from 'react'

import { AugmentedMediaElement } from '@media/hooks/use-augmented-media-ref'
import { MediaControls, MediaPlaybackRate } from '@media/types'

import { useFullscreenAPI, usePiPAPI } from '@/hooks'

export function useMediaControlsFactory(
    media: AugmentedMediaElement | null,
    container: HTMLElement | null,
): MediaControls {
    const [, fullscreenAPI] = useFullscreenAPI()
    const [, pipAPI] = usePiPAPI()

    const mediaControls: MediaControls = useMemo(
        () => ({
            play: () => media?.play(),
            pause: () => media?.pause(),
            togglePlay: () => (media?.isPlaying ? media.pause() : media?.play()),
            seek: (time: number) => media?.seekTo(time),
            skip: (time: number) => media?.skip(time),
            next: () => media?.next(),
            previous: () => media?.previous(),
            enterFullscreen: () =>
                fullscreenAPI?.request((container || media?.current) ?? null, media?.current ?? null),
            exitFullscreen: () => fullscreenAPI?.exit(),
            toggleFullscreen: () =>
                fullscreenAPI?.toggle((container || media?.current) ?? null, media?.current ?? null),
            enterPiP: () => {
                if (!pipAPI || !(media?.current?.tagName === 'VIDEO')) return
                pipAPI.request(media.current as HTMLVideoElement)
            },
            exitPiP: () => pipAPI?.exit(),
            togglePiP: () => {
                if (!pipAPI || !(media?.current?.tagName === 'VIDEO')) return
                pipAPI.toggle(media.current as HTMLVideoElement)
            },
            mute: () => media?.setMuted(true),
            unmute: () => media?.setMuted(false),
            toggleMute: () => media?.setMuted(muted => !muted),
            setProgress: (progress: number | ((progress: number) => number)) => {
                const newProgress = typeof progress === 'function' ? progress(media?.getProgress() ?? 0) : progress
                media?.setProgress(newProgress)
            },
            setVolume: (volume: number | ((volume: number) => number)) => {
                const newVolume = typeof volume === 'function' ? volume(media?.getVolume() ?? 1) : volume
                media?.setVolume(newVolume)
            },
            setPlaybackRate: (
                playbackRate: MediaPlaybackRate | ((playbackRate: MediaPlaybackRate) => MediaPlaybackRate),
            ) => {
                const newPlaybackRate =
                    typeof playbackRate === 'function' ? playbackRate(media?.getPlaybackRate() ?? 1) : playbackRate
                media?.setPlaybackRate(newPlaybackRate)
            },
        }),
        [media, container, fullscreenAPI],
    )

    return mediaControls
}
