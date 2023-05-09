/* ┐
   │ File: use-remote-playback-api.ts [/src/hooks/use-remote-playback-api.ts]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 25th, 2023 - 14:12:46
   │ Modified: May 9th, 2023 - 14:00:11
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import { useCallback, useEffect, useRef, useState } from 'react'

interface UseRemotePlaybackAPI {
    isAvailable: boolean
    state: 'connected' | 'disconnected' | 'connecting'
    requestRemotePlayback: () => void
}

function useRemotePlaybackAPI(target: HTMLVideoElement | null): UseRemotePlaybackAPI {
    const [state, setState] = useState<UseRemotePlaybackAPI['state']>('disconnected')
    const [isAvailable, setAvailable] = useState(false)
    const watcherId = useRef<number | null>(null)

    const updateState = useCallback(function _(this: RemotePlayback) {
        setState(this.state)
    }, [])

    const request = useCallback(() => {
        if (!isAvailable || !target || !target.remote) return

        target.remote
            .prompt()
            .then(() => {
                updateState.call(target.remote)
            })
            .catch(() => {
                updateState.call(target.remote)
                setAvailable(false)
            })
        setState('connecting')
    }, [target, isAvailable])

    useEffect(() => {
        if (!target || !target.remote) return

        if (watcherId.current) target.remote.cancelWatchAvailability(watcherId.current)

        target.remote
            .watchAvailability(available => {
                setAvailable(!!available)
            })
            .then(id => {
                watcherId.current = id
            })
            .catch(() => {
                setAvailable(false)
            })
        target.remote.onconnecting = updateState
        target.remote.onconnect = updateState
        target.remote.ondisconnect = updateState

        return () => {
            if (watcherId.current) target.remote.cancelWatchAvailability(watcherId.current)
            target.remote.onconnecting = null
            target.remote.onconnect = null
            target.remote.ondisconnect = null
        }
    }, [target])

    return {
        state,
        isAvailable,
        requestRemotePlayback: request,
    }
}

export default useRemotePlaybackAPI
