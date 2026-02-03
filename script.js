class MusicApp {
    constructor() {
        this.currentTrack = null;
        this.currentTrackIndex = 0;
        this.tracks = [];
        this.isPlaying = false;
        
        this.initializeElements();
        this.bindEvents();
        this.loadPopularTracks();
    }

    initializeElements() {
        // Search elements
        this.searchInput = document.getElementById('searchInput');
        this.searchBtn = document.getElementById('searchBtn');
        
        // Player elements
        this.audioPlayer = document.getElementById('audioPlayer');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.progress = document.getElementById('progress');
        this.progressBar = document.querySelector('.progress-bar');
        this.currentTime = document.getElementById('currentTime');
        this.duration = document.getElementById('duration');
        
        // Track info elements
        this.currentTrackTitle = document.getElementById('currentTrackTitle');
        this.currentTrackArtist = document.getElementById('currentTrackArtist');
        this.currentTrackImage = document.getElementById('currentTrackImage');
        this.nowPlaying = document.getElementById('nowPlaying');
        
        // Results elements
        this.tracksList = document.getElementById('tracksList');
        this.resultsTitle = document.getElementById('resultsTitle');
        this.loading = document.getElementById('loading');
    }

    bindEvents() {
        // Search events
        this.searchBtn.addEventListener('click', () => this.searchTracks());
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchTracks();
        });

        // Player events
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.prevBtn.addEventListener('click', () => this.previousTrack());
        this.nextBtn.addEventListener('click', () => this.nextTrack());
        
        // Audio events
        this.audioPlayer.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audioPlayer.addEventListener('timeupdate', () => this.updateProgress());
        this.audioPlayer.addEventListener('ended', () => this.nextTrack());
        
        // Progress bar click
        this.progressBar.addEventListener('click', (e) => this.setProgress(e));
    }

    async loadPopularTracks() {
        this.showLoading(true);
        try {
            // Using iTunes Search API for demo purposes
            const response = await fetch('https://itunes.apple.com/search?term=popular&media=music&limit=20');
            const data = await response.json();
            
            this.tracks = data.results.map(track => ({
                id: track.trackId,
                title: track.trackName,
                artist: track.artistName,
                preview: track.previewUrl,
                image: track.artworkUrl100,
                duration: track.trackTimeMillis
            })).filter(track => track.preview); // Only tracks with preview
            
            this.displayTracks(this.tracks);
            this.resultsTitle.textContent = 'Popular Tracks';
        } catch (error) {
            this.showError('Failed to load popular tracks');
        }
        this.showLoading(false);
    }

    async searchTracks() {
        const query = this.searchInput.value.trim();
        if (!query) return;

        this.showLoading(true);
        try {
            const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=20`);
            const data = await response.json();
            
            this.tracks = data.results.map(track => ({
                id: track.trackId,
                title: track.trackName,
                artist: track.artistName,
                preview: track.previewUrl,
                image: track.artworkUrl100,
                duration: track.trackTimeMillis
            })).filter(track => track.preview);
            
            this.displayTracks(this.tracks);
            this.resultsTitle.textContent = `Search Results for "${query}"`;
        } catch (error) {
            this.showError('Failed to search tracks');
        }
        this.showLoading(false);
    }

    displayTracks(tracks) {
        if (tracks.length === 0) {
            this.tracksList.innerHTML = '<div class="error">No tracks found</div>';
            return;
        }

        this.tracksList.innerHTML = tracks.map((track, index) => `
            <div class="track-item" data-index="${index}">
                <img src="${track.image}" alt="${track.title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjZjBmMGYwIi8+CjxwYXRoIGQ9Ik0zMCAyMEM0MS4wNDU3IDIwIDUwIDI4Ljk1NDMgNTAgNDBDNTAgNTEuMDQ1NyA0MS4wNDU3IDYwIDMwIDYwQzE4Ljk1NDMgNjAgMTAgNTEuMDQ1NyAxMCA0MEMxMCAyOC45NTQzIDE4Ljk1NDMgMjAgMzAgMjBaIiBmaWxsPSIjZGRkIi8+CjxwYXRoIGQ9Ik0zNSAzNUwyNSA0MEwzNSA0NVYzNVoiIGZpbGw9IiM5OTkiLz4KPC9zdmc+'">
                <div class="track-item-info">
                    <h4>${track.title}</h4>
                    <p>${track.artist}</p>
                </div>
                <span class="track-duration">${this.formatDuration(track.duration)}</span>
            </div>
        `).join('');

        // Add click events to track items
        document.querySelectorAll('.track-item').forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.dataset.index);
                this.playTrack(index);
            });
        });
    }

    playTrack(index) {
        if (index < 0 || index >= this.tracks.length) return;

        this.currentTrackIndex = index;
        this.currentTrack = this.tracks[index];

        // Update UI
        this.updateTrackInfo();
        this.updateActiveTrack();
        
        // Load and play audio
        this.audioPlayer.src = this.currentTrack.preview;
        this.audioPlayer.load();
        this.play();
        
        // Show now playing section
        this.nowPlaying.style.display = 'block';
    }

    updateTrackInfo() {
        if (!this.currentTrack) return;

        this.currentTrackTitle.textContent = this.currentTrack.title;
        this.currentTrackArtist.textContent = this.currentTrack.artist;
        this.currentTrackImage.src = this.currentTrack.image;
    }

    updateActiveTrack() {
        document.querySelectorAll('.track-item').forEach((item, index) => {
            item.classList.toggle('active', index === this.currentTrackIndex);
        });
    }

    play() {
        this.audioPlayer.play();
        this.isPlaying = true;
        this.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }

    pause() {
        this.audioPlayer.pause();
        this.isPlaying = false;
        this.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    }

    togglePlayPause() {
        if (!this.currentTrack) return;

        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    previousTrack() {
        if (this.currentTrackIndex > 0) {
            this.playTrack(this.currentTrackIndex - 1);
        }
    }

    nextTrack() {
        if (this.currentTrackIndex < this.tracks.length - 1) {
            this.playTrack(this.currentTrackIndex + 1);
        }
    }

    updateProgress() {
        if (!this.audioPlayer.duration) return;

        const progressPercent = (this.audioPlayer.currentTime / this.audioPlayer.duration) * 100;
        this.progress.style.width = `${progressPercent}%`;
        this.currentTime.textContent = this.formatTime(this.audioPlayer.currentTime);
    }

    updateDuration() {
        this.duration.textContent = this.formatTime(this.audioPlayer.duration);
    }

    setProgress(e) {
        if (!this.audioPlayer.duration) return;

        const rect = this.progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const progressPercent = clickX / rect.width;
        this.audioPlayer.currentTime = progressPercent * this.audioPlayer.duration;
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    formatDuration(milliseconds) {
        if (!milliseconds) return '0:00';
        
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    showLoading(show) {
        this.loading.style.display = show ? 'block' : 'none';
        if (!show) {
            this.tracksList.style.display = 'grid';
        }
    }

    showError(message) {
        this.tracksList.innerHTML = `<div class="error">${message}</div>`;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MusicApp();
});