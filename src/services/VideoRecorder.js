import { VideoStorage } from './VideoStorage';

class VideoRecorder {
    _cleanupStreams() {
        if (this.displayStream) {
            try {
                this.displayStream.getTracks().forEach(track => track.stop());
            } catch (_) {
                // ignore
            }
        }
        if (this.userMediaStream) {
            try {
                this.userMediaStream.getTracks().forEach(track => track.stop());
            } catch (_) {
                // ignore
            }
        }
        this.displayStream = null;
        this.userMediaStream = null;
    }

    _detachInactiveListener() {
        if (this.displayStream && this.stopCallback) {
            try {
                this.displayStream.removeEventListener('inactive', this.stopCallback);
            } catch (_) {
                // ignore
            }
        }
    }

    _startUserMediaCapture() {
        const constraints = {
            audio: true,
            video: false
        };

        return navigator.mediaDevices.getUserMedia(constraints);
    }

    _startDisplayMediaCapture() {
        const constraints = {
            audio: {
                channelCount: {
                    ideal: 2
                }
            },
            video: true,
        }
        return navigator.mediaDevices.getDisplayMedia(constraints);
    }

    async start(options) {
        const { format, recordMicrophoneAudio, stopCallback } = options;
        this.format = format;
        this.stopCallback = stopCallback;

        this.chunks = [];
        VideoStorage.clear();

        try {
            this.displayStream = await this._startDisplayMediaCapture();

            if (recordMicrophoneAudio) {
                this.userMediaStream = await this._startUserMediaCapture();
            }

            this.displayStream.addEventListener('inactive', this.stopCallback);

            this.combinedStream = [
                ...this.displayStream.getTracks(),
            ];
            if (this.userMediaStream) {
                this.userMediaStream.getAudioTracks().forEach(track => this.combinedStream.push(track));
            }

            this.mediaStream = new MediaStream(this.combinedStream);
            this.mediaRecorder = new MediaRecorder(this.mediaStream, { mimeType: format });

            this.mediaRecorder.addEventListener('dataavailable', event => {
                if (event.data && event.data.size > 0) {
                    this.chunks.push(event.data);
                }
            });
            this.mediaRecorder.start(10);
        } catch (e) {
            this._detachInactiveListener();
            this._cleanupStreams();
            this.mediaRecorder = null;
            throw e;
        }
    }

    async stop() {
        const recorder = this.mediaRecorder;
        if (!recorder) return;
        if (recorder.state === 'inactive') return;

        const dimensions = (() => {
            try {
                const videoTrack = this.displayStream && this.displayStream.getVideoTracks
                    ? this.displayStream.getVideoTracks()[0]
                    : null;
                if (!videoTrack || !videoTrack.getSettings) return null;
                const { width, height } = videoTrack.getSettings();
                if (!width || !height) return null;
                return { width, height };
            } catch (_) {
                return null;
            }
        })();

        await new Promise(resolve => {
            const onStop = () => resolve();
            recorder.addEventListener('stop', onStop, { once: true });
            try {
                recorder.stop();
            } catch (_) {
                resolve();
            }
        });

        this.mediaRecorder = null;
        this._detachInactiveListener();
        this._cleanupStreams();

        const blob = new Blob(this.chunks || [], { type: this.format });
        VideoStorage.setFromBlob(blob);

        return dimensions ? { dimensions } : {};
    }
}

const videoRecorder = new VideoRecorder();

export default videoRecorder;