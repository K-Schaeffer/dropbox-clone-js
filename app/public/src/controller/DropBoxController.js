class DropBoxController {

    constructor() {

        this.btnSendFileEl = document.querySelector("#btn-send-file");
        this.inputFilesEl = document.querySelector("#files");
        this.snackModalEl = document.querySelector("#react-snackbar-root");
        this.progressBarEl = this.snackModalEl.querySelector(".mc-progress-bar-fg");
        this.nameFileEl = this.snackModalEl.querySelector(".filename");
        this.timeLeftEl = this.snackModalEl.querySelector(".timeleft");

        this.initEvents();

    }

    initEvents() {

        this.btnSendFileEl.addEventListener('click', event => {

            this.inputFilesEl.click();

        });

        this.inputFilesEl.addEventListener('change', event => {
            this.uploadTask(event.target.files);

            this.modalVisibility();

            this.inputFilesEl.value = '';
        });

    }

    modalVisibility(isVisible = true) {
        this.snackModalEl.style.display = (isVisible) ? 'block' : 'none';
    }

    uploadTask(files) {

        let promises = [];

        [...files].forEach(file => {

            promises.push(new Promise((resolve, reject) => {

                let ajax = new XMLHttpRequest();

                ajax.open('POST', '/upload');
                ajax.onload = event => {

                    this.modalVisibility(false);

                    try {
                        resolve(JSON.parse(ajax.responseText));
                    } catch (e) {
                        reject(e);
                    }

                };

                ajax.onerror = event => {
                    this.modalVisibility(false);
                    reject(event);
                };

                ajax.upload.onprogress = event => {

                    this.uploadProgress(event, file);
                }

                let formData = new FormData();

                formData.append('input-file', file);

                this.startUploadTime = Date.now();

                ajax.send(formData);

            }));

        });

        return Promise.all(promises);

    }

    uploadProgress(event, file) {

        let timeSpent = Date.now() - this.startUploadTime;
        let loaded = event.loaded;
        let total = event.total;
        let percent = parseInt((loaded / total) * 100);
        let timeLeft = ((100 - percent) * timeSpent) / percent;

        this.progressBarEl.style.width = percent + '%';

        this.nameFileEl.innerHTML = file.name;
        this.timeLeftEl.innerHTML = this.formatTime(timeLeft);
    }

    formatTime(duration) {

        let seconds = parseInt((duration / 1000) % 60);
        let minutes = parseInt((duration / (1000 * 60)) % 60);
        let hours = parseInt((duration / (1000 * 60 * 60)) % 24);

        if (hours > 0) {
            return `${hours} hours, ${minutes} minutes and ${seconds} seconds`;
        }

        if (minutes > 0) {
            return `${minutes} minutes and ${seconds} seconds`;

        }

        if (seconds > 0) {
            return `${seconds} seconds`;
        }

        return '';
    }

}