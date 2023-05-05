/* ┐
   │ File: analyser.js [/src-old/analyser.js]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: January 15th, 2021 - 9:52:28
   │ Modified: May 5th, 2023 - 14:51:53
   │
   │ Copyright (c) 2021 - 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */

/**
 * THIS IS OLD CODE FROM v1
 * NEEDS TO BE REWRITTEN FOR v2
 */

// Called as:
// const analyser = new Analyser({
//     mediaElem: 'rs1-media-player-element',
//     mediaType: metadata.video ? 'video' : 'audio',
//     ...options.analyserSetup,
// })

export default class {
    constructor({
        mediaElem = '',
        mediaType = 'audio',
        smoothingTimeConstant = 0.95,
        fftSize = 64,
        minDecibels = -100,
        maxDecibels = -30,
    } = {}) {
        this.mediaElem = mediaElem

        this.ctx = new (window.AudioContext || window.webkitAudioContext)()

        this.analyser = this.ctx.createAnalyser()
        this.analyser.smoothingTimeConstant = smoothingTimeConstant
        this.analyser.fftSize = fftSize
        this.analyser.minDecibels = minDecibels
        this.analyser.maxDecibels = maxDecibels
        this.bufferLength = this.analyser.frequencyBinCount

        this.floatFrequencyData = new Float32Array(this.bufferLength)
        this.byteFrequencyData = new Uint8Array(this.bufferLength)
        this.floatTimeDomainData = new Float32Array(this.bufferLength)
        this.byteTimeDomainData = new Uint8Array(this.bufferLength)

        this.isAnalysing = false
        this.audioSource = null

        this.updateSource(mediaType)
    }

    updateSource(mediaType = 'audio') {
        if (this.audioSource) {
            this.audioSource.disconnect()
        }
        const elem = document.getElementById(this.mediaElem)
        if (elem) {
            this.mediaSourceType = mediaType
            this.audioSource = this.ctx.createMediaElementSource(elem)
            this.audioSource.connect(this.analyser)
            this.analyser.connect(this.ctx.destination)
            this.isAnalysing = true
        }
    }

    get floatFrequency() {
        this.analyser.getByteFrequencyData(this.floatFrequencyData)
        return this.floatFrequencyData
    }

    get byteFrequency() {
        this.analyser.getByteFrequencyData(this.byteFrequencyData)
        return this.byteFrequencyData
    }

    get floatTimeDomain() {
        this.analyser.getFloatTimeDomainData(this.floatTimeDomainData)
        return this.floatTimeDomainData
    }

    get byteTimeDomain() {
        this.analyser.getByteTimeDomainData(this.byteTimeDomainData)
        return this.byteTimeDomainData
    }
}
