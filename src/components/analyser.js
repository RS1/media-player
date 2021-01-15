export default class {
    constructor({
        mediaElem = '',
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
        const elem = document.getElementById(this.mediaElem)
        if (elem) {
            const source = this.ctx.createMediaElementSource(elem)
            source.connect(this.analyser)
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
