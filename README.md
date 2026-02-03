# Leo

#Music Player App

A modern, responsive music player web application built with vanilla JavaScript, HTML, and CSS. Features integration with the iTunes Search API for music discovery and playback.

## Features

- 🎵 Search for songs and artists
- 🎧 Audio playback with controls (play, pause, next, previous)
- 📱 Responsive design for mobile and desktop
- 🎨 Modern gradient UI with smooth animations
- ⏱️ Progress bar with click-to-seek functionality
- 🔄 Auto-play next track when current track ends
- 📊 Display track information (title, artist, artwork, duration)

## API Integration

This app uses the **iTunes Search API** which provides:
- Free access without API key requirements
- 30-second preview tracks
- High-quality album artwork
- Comprehensive music metadata

## How to Use

1. Open `index.html` in your web browser
2. Browse popular tracks that load automatically
3. Use the search bar to find specific songs or artists
4. Click on any track to start playing
5. Use the player controls to manage playback

## File Structure

```
music-app/
├── index.html      # Main HTML structure
├── styles.css      # CSS styling and responsive design
├── script.js       # JavaScript functionality and API integration
└── README.md       # This file
```

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Technical Details

- **No external dependencies** except Font Awesome for icons
- Uses modern JavaScript features (ES6+ classes, async/await)
- Responsive CSS Grid and Flexbox layouts
- Cross-Origin Resource Sharing (CORS) compatible API

## Limitations

- Preview tracks are limited to 30 seconds (iTunes API limitation)
- Requires internet connection for API calls
- Some tracks may not have preview URLs available

## Future Enhancements

- Playlist functionality
- Volume control M
- Shuffle and repeat modes
- Local storage for favorites
- Integration with additional music APIs
