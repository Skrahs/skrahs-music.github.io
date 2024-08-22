class MusicPlayer {
    constructor() {
        this.audio = new Audio();
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.progressContainer = document.getElementById('progressContainer');
        this.progress = document.getElementById('progress');
        this.currentTimeEl = document.getElementById('currentTime');
        this.durationEl = document.getElementById('duration');
        this.loopBtn = document.getElementById('loopBtn');

        this.tracks = [
            { title: '<3', path: 'songs/audio.mp3' },
            { title: 'D:', path: 'songs/audio2.mp3' }
        ];
        this.currentTrackIndex = 0;
        this.isLooping = false;

        this.loadTrack(this.currentTrackIndex);

        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.nextBtn.addEventListener('click', () => this.nextTrack());
        this.prevBtn.addEventListener('click', () => this.prevTrack());
        this.progressContainer.addEventListener('click', (e) => this.setProgress(e));
        this.loopBtn.addEventListener('click', () => this.toggleLoop());

        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.handleTrackEnd());
    }

    loadTrack(index) {
        if (this.tracks.length > 0) {
            const track = this.tracks[index];
            this.audio.src = track.path;
            this.audio.play().then(() => {
                document.querySelector('.song-title').textContent = track.title;
                this.playPauseBtn.innerHTML = '&#10074;&#10074;'; 
            }).catch(error => {
                console.error('Errore nella riproduzione audio:', error);
            });
        }
    }

    togglePlayPause() {
        if (this.audio.paused) {
            this.audio.play();
            this.playPauseBtn.innerHTML = '&#10074;&#10074;'; 
        } else {
            this.audio.pause();
            this.playPauseBtn.innerHTML = '&#9654;'; 
        }
    }

    nextTrack() {
        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
        this.loadTrack(this.currentTrackIndex);
    }

    prevTrack() {
        this.currentTrackIndex = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
        this.loadTrack(this.currentTrackIndex);
    }

    handleTrackEnd() {
        if (this.isLooping) {
            this.audio.currentTime = 0;
            this.audio.play();
        } else {
            this.nextTrack();
        }
    }

    updateProgress() {
        if (this.audio.duration) {
            const progressPercent = (this.audio.currentTime / this.audio.duration) * 100;
            this.progress.style.width = `${progressPercent}%`;

            this.currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
            this.durationEl.textContent = this.formatTime(this.audio.duration);
        }
    }

    formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    setProgress(e) {
        const width = this.progressContainer.clientWidth;
        const clickX = e.offsetX;
        const duration = this.audio.duration;

        this.audio.currentTime = (clickX / width) * duration;
    }

    toggleLoop() {
        this.isLooping = !this.isLooping;
        this.loopBtn.classList.toggle('active', this.isLooping);
    }
}

document.addEventListener('DOMContentLoaded', () => new MusicPlayer());
