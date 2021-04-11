import { VideoStorage } from './VideoStorage';

class VideoRecorder {

    _startUserMediaCapture() {
        const constraints = {
            audio: true,
            video: false
        };

        if (navigator.getUserMedia) {
            return new Promise((resolve, reject) =>
                navigator.getUserMedia(constraints, resolve, reject));
        } else if (navigator.mediaDevices.getUserMedia) {
            return navigator.mediaDevices.getUserMedia(constraints);
        }
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
        if (navigator.getDisplayMedia) {
            return navigator.getDisplayMedia(constraints);
        } else if (navigator.mediaDevices.getDisplayMedia) {
            return navigator.mediaDevices.getDisplayMedia(constraints);
        }
    }

    async start(options) {
        const { format, recordMicrophoneAudio, stopCallback } = options;
        this.format = format;
        this.stopCallback = stopCallback;

        if (this.recording) {
            window.URL.revokeObjectURL(this.recording);
        }

        this.chunks = [];
        this.recording = null;

        this.displayStream = await this._startDisplayMediaCapture();

        if (this.displayStream.getAudioTracks().length > 0) {
            console.log('Added system audio.');
        }

        if (recordMicrophoneAudio) {
            this.userMediaStream = await this._startUserMediaCapture();

            if (this.userMediaStream && this.userMediaStream.getAudioTracks().length > 0) {
                console.log('Added microphone audio.');
            }
        }

        console.log('Started recording.');

        this.displayStream.addEventListener('inactive', this.stopCallback);

        this.combinedStream = [
            ...this.displayStream.getTracks(),
        ];
        if (this.userMediaStream) {
            this.userMediaStream.getAudioTracks.forEach(track => this.combinedStream.push(track));
        }

        this.mediaStream = new MediaStream(this.combinedStream);
        this.mediaRecorder = new MediaRecorder(this.mediaStream, { mimeType: format });

        this.mediaRecorder.addEventListener('dataavailable', event => {
            if (event.data && event.data.size > 0) {
                this.chunks.push(event.data);
            }
        });
        this.mediaRecorder.start(10);
    }

    async stop() {
        if (!this.mediaRecorder) return;
        if (this.mediaRecorder.state === 'inactive') return;

        this.mediaRecorder.stop();
        this.mediaRecorder = null;

        this.displayStream.getTracks().forEach(track => track.stop());

        if (this.userMediaStream) {
            this.userMediaStream.getTracks().forEach(track => track.stop());
        }
        
        console.log('Stoped recording.');

        this.displayStream.removeEventListener('inactive', this.stopCallback);
        const videoTrack = this.displayStream.getVideoTracks()[0];
        const { width, height } = videoTrack.getSettings();

        this.displayStream = null;
        this.userMediaStream = null;

        const blob = new Blob(this.chunks, { type: this.format });
        VideoStorage.objectUrl = window.URL.createObjectURL(blob);
        VideoStorage.size = blob.size;
        VideoStorage.type = blob.type;

        return {
            dimensions: { width, height }
        }
    }
}

const videoRecorder = new VideoRecorder();

export default videoRecorder;