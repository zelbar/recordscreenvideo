import { VideoStorage } from './VideoStorage';

class VideoRecorder {

    _startUserMediaCapture() {
        const constraints = { audio: true, video: false };

        if (navigator.getUserMedia) {
            return new Promise((resolve, reject) => navigator.getUserMedia(constraints, resolve, reject));
        } else if (navigator.mediaDevices.getUserMedia) {
            return navigator.mediaDevices.getUserMedia(constraints);
        }
    }

    _startDisplayCapture() {
        const videoParams = true;

        if (navigator.getDisplayMedia) {
            return navigator.getDisplayMedia({ video: videoParams });
        } else if (navigator.mediaDevices.getDisplayMedia) {
            return navigator.mediaDevices.getDisplayMedia({ video: videoParams });
        }
    }

    async start(options) {
        const {format, recordMicrophoneAudio, stopCallback} = options;
        this.format = format;
        this.stopCallback = stopCallback;

        if (this.recording) {
            window.URL.revokeObjectURL(this.recording);
        }

        this.chunks = [];
        this.recording = null;

        if (recordMicrophoneAudio) {
            this.userStream = await this._startUserMediaCapture();
        }

        this.displayStream = await this._startDisplayCapture();

        console.log('Start recording.');

        this.displayStream.addEventListener('inactive', this.stopCallback);

        this.combinedStream = [this.displayStream.getTracks()[0]];
        if (this.userStream) {
            this.combinedStream.push(this.userStream.getTracks()[0]);
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

        console.log('Stop recording.');

        this.displayStream.removeEventListener('inactive', this.stopCallback);

        const track = this.displayStream.getTracks()[0];
        const { width, height } = track.getSettings();

        this.mediaRecorder.stop();
        this.mediaRecorder = null;
        this.displayStream.getTracks().forEach(track => track.stop());
        if (this.userStream) {
            this.userStream.getTracks().forEach(track => track.stop());
        }
        this.displayStream = null;
        this.userStream = null;

        const blob = new Blob(this.chunks, { type: this.format });
        VideoStorage.objectUrl = window.URL.createObjectURL(blob);
        VideoStorage.size = blob.size;
        VideoStorage.type = blob.type;

        return {
            dimensions: { width, height},
        }
    }
}

const videoRecorder = new VideoRecorder();

export default videoRecorder;