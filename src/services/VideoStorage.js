export const VideoStorage = {
    objectUrl: null,
    size: 0,
    type: null,
    clear() {
        if (this.objectUrl) {
            try {
                window.URL.revokeObjectURL(this.objectUrl);
            } catch (_) {
                // ignore
            }
        }
        this.objectUrl = null;
        this.size = 0;
        this.type = null;
    },
    setFromBlob(blob) {
        this.clear();
        this.objectUrl = window.URL.createObjectURL(blob);
        this.size = blob.size;
        this.type = blob.type;
    }
};