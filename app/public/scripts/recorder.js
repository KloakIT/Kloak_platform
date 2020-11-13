class Recorder {
    constructor(callback, exit) {
        this.callback = callback;
        this.exit = exit;
        this.mediaRecorder = null;
        this.stream = null;
        this.player = document.getElementById("recordPreview");
        this.uuid = null;
        this.date = new Date().toLocaleString();
        this.filename = 'Recording ' + this.date + '.webm';
        this.chunks = [];
        this.facingMode = "environment";
        this.init = () => {
            if (navigator.mediaDevices) {
                const contraints = { video: {
                        height: { ideal: 720 },
                        width: { ideal: 1280 },
                        frameRate: { ideal: 30 },
                        facingMode: this.facingMode
                    },
                    audio: true };
                navigator.mediaDevices.getUserMedia(contraints).then(stream => {
                    this.stream = stream;
                    this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs="vp9, opus"' });
                    // this.setupButtons()
                    this.mediaRecorder.ondataavailable = e => {
                        this.chunks.push(e.data);
                        console.log(e.data);
                    };
                    this.mediaRecorder.onstop = e => {
                        this.saveFile();
                        this.callback(null, this.uuid);
                    };
                    this.player['srcObject'] = stream;
                });
            }
        };
        this.switchCamera = () => {
            this.closeTracks();
            this.mediaRecorder = null;
            this.player['srcObject'] = null;
            this.facingMode === 'user' ? this.facingMode = 'environment' : this.facingMode = 'user';
            this.init();
        };
        this.start = () => {
            this.mediaRecorder.start();
        };
        this.stop = () => {
            this.mediaRecorder.stop();
        };
        this.pause = () => {
            this.mediaRecorder.pause();
        };
        this.takePicture = () => {
            const canvas = document.createElement("canvas");
            canvas.width = 1920;
            canvas.height = 1080;
            const ctx = canvas.getContext('2d');
            const player = document.getElementById("recordPreview");
            ctx.drawImage(player, 0, 0, canvas.width, canvas.height);
            this.uuid = uuid_generate();
            canvas.toBlob(blob => {
                _view.storageHelper.createUploader(uuid_generate(), new File([blob], `Photo ${new Date().toLocaleString()}.jpeg`, { type: 'image/jpeg' }), "", ['picture'], (err, data) => {
                    if (err) {
                        this.callback(err, null);
                        return;
                    }
                    if (data) {
                        this.callback(null, this.uuid);
                        return;
                    }
                });
            }, 'image/jpeg');
        };
        this.saveFile = () => {
            const file = new File(this.chunks, this.filename, { type: 'video/webm' });
            console.log(file);
            this.uuid = uuid_generate();
            _view.storageHelper.createUploader(this.uuid, file, "", ['recording'], (err, data) => {
                if (err) {
                    console.log(err);
                    return;
                }
                if (data) {
                    this.callback(null, this.uuid);
                    console.log("file uploaded");
                }
            });
            this.chunks = [];
            // console.log(blob)
            // _view.displayMedia('player')
            // let player = document.getElementById("videoPlayer")
            // player['src'] = URL.createObjectURL(blob)
        };
        this.closeTracks = () => {
            this.stream.getTracks().forEach(track => {
                track.stop();
            });
        };
        this.close = () => {
            this.closeTracks();
            this.mediaRecorder = null;
            this.player['srcObject'] = null;
            this.exit();
        };
        this.init();
    }
}
