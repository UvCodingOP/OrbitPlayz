document.addEventListener('DOMContentLoaded', function() {
    console.log("Your website is ready!");
    
    // Additional JavaScript functionality can go here

    // Navbar scroll effect
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animate elements when they come into view
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.section');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Set initial styles for animation
    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.8s ease-out';
    });

    // Run animation on scroll
    window.addEventListener('scroll', animateOnScroll);
    // Run once on page load
    animateOnScroll();

    // Character interaction
    const character = document.querySelector('.character');
    if (character) {
        character.addEventListener('click', function() {
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = 'jump 0.5s ease-out';
                setTimeout(() => {
                    this.style.animation = 'float 6s ease-in-out infinite';
                }, 500);
            }, 10);
        });
    }

    // Add jump animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes jump {
            0% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-50px) rotate(5deg); }
            100% { transform: translateY(0) rotate(0deg); }
        }
    `;
    document.head.appendChild(style);

    // Load YouTube videos
    loadYouTubeVideos();

    // Add Minecraft-style particles
    createMinecraftParticles();

    // Load channel statistics
    loadChannelStatistics();

    // Fix for home button navigation
    const homeLink = document.querySelector('.nav-links a[href="#home"]');
    if (homeLink) {
        homeLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Alternative fix if you're using a different selector for the home link
    const allNavLinks = document.querySelectorAll('.nav-links a');
    allNavLinks.forEach(link => {
        if (link.textContent.toLowerCase().includes('home') || link.getAttribute('href') === '#home') {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    });
});

const character = document.querySelector('.character');
character.addEventListener('mouseover', () => {
    character.classList.add('walking');
});

character.addEventListener('mouseout', () => {
    character.classList.remove('walking');
});

// YouTube API configuration
const YOUTUBE_API_KEY = 'AIzaSyBL9M_ENMc0puZn8c64dOt3HMpdXHSCFOc';
const CHANNEL_ID = '@OrbitPlayzOfficial'; // Replace with the actual channel ID you found
const MAX_RESULTS = 3; // Number of videos to display

// Function to get OrbitPlayz's channel ID
function getOrbitPlayzChannelId() {
    // Try to find the channel ID directly
    return new Promise((resolve, reject) => {
        // First try with the username
        getChannelIdFromUsername('OrbitPlayzOfficial')
            .then(channelId => {
                if (channelId) {
                    console.log('Found channel ID via username:', channelId);
                    resolve(channelId);
                } else {
                    // If that fails, try with a search
                    console.log('Username lookup failed, trying search...');
                    return searchChannelByHandle('OrbitPlayzOfficial');
                }
            })
            .then(channelId => {
                if (channelId) {
                    console.log('Found channel ID via search:', channelId);
                    resolve(channelId);
                } else {
                    // If all automatic methods fail, use a hardcoded ID if you know it
                    console.log('All lookups failed, using hardcoded ID...');
                    // You would need to find this manually
                    const hardcodedId = 'UC...'; // Replace with actual channel ID if you can find it
                    resolve(hardcodedId);
                }
            })
            .catch(error => {
                console.error('Error in channel ID lookup chain:', error);
                reject(error);
            });
    });
}

// Function to load YouTube videos using the YouTube Data API
function loadYouTubeVideos() {
    console.log('Starting to load YouTube videos...');
    const videoContainer = document.getElementById('youtube-videos');
    
    if (!videoContainer) {
        console.error('Video container not found!');
        return;
    }
    
    // Log your API key (first few characters only for security)
    const keyStart = YOUTUBE_API_KEY.substring(0, 5);
    console.log(`Using API key starting with: ${keyStart}...`);
    
    getOrbitPlayzChannelId()
        .then(channelId => {
            if (channelId) {
                fetchVideosFromChannel(channelId, videoContainer);
            } else {
                useHardcodedVideos(videoContainer);
            }
        })
        .catch(error => {
            console.error('Final error getting channel ID:', error);
            showFallbackVideos();
        });
}

// Function to get channel ID from username
function getChannelIdFromUsername(username) {
    const url = `https://www.googleapis.com/youtube/v3/channels?part=id&forUsername=${username}&key=${YOUTUBE_API_KEY}`;
    
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.items && data.items.length > 0) {
                return data.items[0].id;
            } else {
                // If username search fails, try searching by handle
                return searchChannelByHandle(username);
            }
        });
}

// Function to search for channel by handle (newer YouTube handles)
function searchChannelByHandle(handle) {
    // Remove @ if present
    handle = handle.replace('@', '');
    
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${handle}&type=channel&key=${YOUTUBE_API_KEY}`;
    
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.items && data.items.length > 0) {
                return data.items[0].id.channelId;
            }
            return null;
        });
}

// Function to fetch videos from a channel
function fetchVideosFromChannel(channelId, container) {
    // Show loading state
    container.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading latest videos...</p>
        </div>
    `;
    
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=${MAX_RESULTS}&order=date&type=video&key=${YOUTUBE_API_KEY}`;
    
    fetch(url)
        .then(response => {
            console.log('API Response status:', response.status);
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('API Response data:', data);
            // Clear loading spinner
            container.innerHTML = '';
            
            if (data.items && data.items.length > 0) {
                // Create video cards for each video
                data.items.forEach(item => {
                    try {
                        const videoId = item.id.videoId;
                        
                        // Make sure we have a title
                        let title = 'Minecraft Video';
                        if (item.snippet && item.snippet.title) {
                            title = item.snippet.title;
                        }
                        
                        // Make sure we have a thumbnail
                        let thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;
                        if (item.snippet && item.snippet.thumbnails) {
                            if (item.snippet.thumbnails.high && item.snippet.thumbnails.high.url) {
                                thumbnailUrl = item.snippet.thumbnails.high.url;
                            } else if (item.snippet.thumbnails.medium && item.snippet.thumbnails.medium.url) {
                                thumbnailUrl = item.snippet.thumbnails.medium.url;
                            } else if (item.snippet.thumbnails.default && item.snippet.thumbnails.default.url) {
                                thumbnailUrl = item.snippet.thumbnails.default.url;
                            }
                        }
                        
                        // Create card optimized for smaller layout
                        createVideoCard(container, videoId, title, thumbnailUrl);
                    } catch (err) {
                        console.error('Error creating video card:', err);
                    }
                });
                
                // Store the latest video ID to check for updates later
                if (data.items[0] && data.items[0].id && data.items[0].id.videoId) {
                    localStorage.setItem('latestVideoId', data.items[0].id.videoId);
                }
            } else {
                // No videos found
                container.innerHTML = '<p class="no-videos">No videos found. Please check back later!</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching videos:', error);
            container.innerHTML = `
                <p class="error-message">
                    Couldn't load videos. 
                    <button class="retry-button">Try Again</button>
                </p>
            `;
            
            // Add retry button functionality
            const retryButton = container.querySelector('.retry-button');
            if (retryButton) {
                retryButton.addEventListener('click', () => {
                    fetchVideosFromChannel(channelId, container);
                });
            }
            
            // Fall back to hardcoded videos after a delay
            setTimeout(() => {
                if (container.querySelector('.error-message')) {
                    useHardcodedVideos(container);
                }
            }, 3000);
        });
}

// Function to create a video card that redirects to YouTube
function createVideoCard(container, videoId, title, thumbnailUrl) {
    const videoCard = document.createElement('div');
    videoCard.className = 'video-card';
    videoCard.setAttribute('data-video-id', videoId);
    
    // Create thumbnail with play button overlay
    const thumbnail = document.createElement('div');
    thumbnail.className = 'thumbnail';
    thumbnail.style.backgroundImage = `url(${thumbnailUrl})`;
    
    // Add play button overlay
    const playButton = document.createElement('div');
    playButton.className = 'play-button';
    playButton.innerHTML = '<i class="fas fa-play"></i>';
    thumbnail.appendChild(playButton);
    
    // Create title element with proper handling
    const titleElement = document.createElement('h3');
    titleElement.className = 'video-title';
    
    // Make sure title is a string and not undefined or null
    const safeTitle = title ? String(title) : 'Minecraft Video';
    
    // Decode HTML entities in the title
    const decodedTitle = decodeHTMLEntities(safeTitle);
    
    // Truncate title if it's too long
    const truncatedTitle = decodedTitle.length > 60 ? 
        decodedTitle.substring(0, 57) + '...' : 
        decodedTitle;
    
    // Set the title text
    titleElement.textContent = truncatedTitle;
    
    // Add click event to redirect to YouTube
    videoCard.addEventListener('click', function() {
        // Open YouTube video in a new tab
        window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
    });
    
    // Assemble card
    videoCard.appendChild(thumbnail);
    videoCard.appendChild(titleElement);
    
    // Add to container
    container.appendChild(videoCard);
    
    // Add a tooltip with the full title for hover
    titleElement.setAttribute('title', decodedTitle);
}

// Helper function to decode HTML entities in titles
function decodeHTMLEntities(text) {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
}

// Fallback function using hardcoded videos
function useHardcodedVideos(container) {
    container.innerHTML = '';
    
    // These are example videos - replace with actual videos from OrbitPlayz_'s channel
    const videos = [
        {
            videoId: 'EXAMPLE_VIDEO_ID_1', // Replace with actual video ID
            title: 'Epic Minecraft Survival Episode'
        },
        {
            videoId: 'EXAMPLE_VIDEO_ID_2', // Replace with actual video ID
            title: 'Building My Dream Base'
        },
        {
            videoId: 'EXAMPLE_VIDEO_ID_3', // Replace with actual video ID
            title: 'PVP Tournament Highlights'
        }
    ];
    
    // Create video cards
    videos.forEach(video => {
        const thumbnailUrl = `https://i.ytimg.com/vi/${video.videoId}/mqdefault.jpg`;
        createVideoCard(container, video.videoId, video.title, thumbnailUrl);
    });
    
    // Add a message to visit the channel
    const channelLink = document.createElement('div');
    channelLink.className = 'channel-link';
    channelLink.innerHTML = `
        <p>For the latest videos, visit 
        <a href="https://www.youtube.com/@OrbitPlayzOfficial" target="_blank">
            OrbitPlayz_'s YouTube channel
        </a>
        </p>
    `;
    container.appendChild(channelLink);
}

// Function to check for new videos periodically
function setupVideoRefresh() {
    // Check for new videos every hour
    setInterval(() => {
        checkForNewVideos();
    }, 3600000); // 3600000 ms = 1 hour
}

// Function to check if there are new videos
function checkForNewVideos() {
    const latestVideoId = localStorage.getItem('latestVideoId');
    if (!latestVideoId) return;
    
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=1&order=date&type=video&key=${YOUTUBE_API_KEY}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.items && data.items.length > 0) {
                const newestVideoId = data.items[0].id.videoId;
                
                // If there's a new video
                if (newestVideoId !== latestVideoId) {
                    // Update the stored latest video ID
                    localStorage.setItem('latestVideoId', newestVideoId);
                    
                    // Reload the videos section
                    loadYouTubeVideos();
                    
                    // Show notification
                    showNewVideoNotification(data.items[0].snippet.title);
                }
            }
        })
        .catch(error => console.error('Error checking for new videos:', error));
}

// Function to show a notification when a new video is uploaded
function showNewVideoNotification(title) {
    const notification = document.createElement('div');
    notification.className = 'new-video-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-bell"></i>
            <p>New video uploaded: "${title}"</p>
            <button class="close-notification">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Add styles for the notification
    const style = document.createElement('style');
    style.textContent = `
        .new-video-notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: rgba(255, 0, 0, 0.9);
            color: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            animation: slideIn 0.5s ease-out;
            max-width: 300px;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .notification-content i {
            font-size: 1.5rem;
        }
        
        .close-notification {
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            padding: 0;
            margin-left: auto;
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.close-notification');
    closeBtn.addEventListener('click', function() {
        document.body.removeChild(notification);
    });
    
    // Auto-close after 10 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
    }, 10000);
}

// Function to create Minecraft-style floating particles
function createMinecraftParticles() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    document.body.appendChild(particleContainer);

    // Add CSS for particles
    const style = document.createElement('style');
    style.textContent = `
        .particle-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        }
        .particle {
            position: absolute;
            background-color: rgba(255, 255, 255, 0.5);
            width: 3px;
            height: 3px;
            border-radius: 50%;
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);

    // Create particles
    for (let i = 0; i < 50; i++) {
        createParticle();
    }

    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random position
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        
        // Random size
        const size = Math.random() * 3 + 1;
        
        // Random opacity
        const opacity = Math.random() * 0.5 + 0.1;
        
        // Set styles
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.opacity = opacity;
        
        // Add to container
        particleContainer.appendChild(particle);
        
        // Animate
        animateParticle(particle);
    }

    function animateParticle(particle) {
        // Random duration
        const duration = Math.random() * 15 + 10;
        
        // Random direction
        const xMove = Math.random() * 100 - 50;
        const yMove = -Math.random() * 100 - 50; // Always move up
        
        // Apply animation
        particle.style.transition = `transform ${duration}s linear, opacity ${duration}s ease-in`;
        particle.style.transform = `translate(${xMove}px, ${yMove}px)`;
        particle.style.opacity = '0';
        
        // Remove and create new particle when animation ends
        setTimeout(() => {
            particle.remove();
            createParticle();
        }, duration * 1000);
    }
}

// Set up periodic refresh
setupVideoRefresh();

// Function to load channel statistics
function loadChannelStatistics() {
    console.log('Starting to load channel statistics...');
    const statsContainer = document.querySelector('.stats');
    if (!statsContainer) {
        console.error('Stats container not found!');
        return;
    }
    
    getOrbitPlayzChannelId()
        .then(channelId => {
            if (channelId) {
                fetchChannelStatistics(channelId, statsContainer);
            }
        })
        .catch(error => {
            console.error('Final error getting channel ID for statistics:', error);
        });
}

// Updated helper function to format numbers exactly like YouTube does
function formatNumber(numStr) {
    const num = parseInt(numStr, 10);
    if (isNaN(num)) return '0';
    
    // For subscriber counts (which are already rounded by YouTube API)
    // We want to display them exactly as YouTube does
    if (num >= 1000000) {
        // For millions, YouTube shows #.##M (e.g., 1.23M)
        return (num / 1000000).toFixed(2).replace(/\.?0+$/, '') + 'M';
    }
    if (num >= 10000) {
        // For 10K+, YouTube shows ##.#K (e.g., 12.3K)
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    if (num >= 1000) {
        // For 1K-10K, YouTube shows #.##K (e.g., 1.07K)
        return (num / 1000).toFixed(2).replace(/\.?0+$/, '') + 'K';
    }
    
    // For numbers less than 1000, show the exact number
    return num.toString();
}

// Function to fetch channel statistics with more precise formatting
function fetchChannelStatistics(channelId, statsContainer) {
    const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${channelId}&key=${YOUTUBE_API_KEY}`;
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.items && data.items.length > 0) {
                const statistics = data.items[0].statistics;
                const snippet = data.items[0].snippet;
                
                // Get the raw subscriber count
                const rawSubscriberCount = statistics.subscriberCount;
                
                // Format subscriber count exactly like YouTube does
                const subscriberCount = formatYouTubeSubscriberCount(rawSubscriberCount);
                
                const subscriberElement = statsContainer.querySelector('.stat-item:nth-child(1) .stat-number');
                if (subscriberElement) {
                    subscriberElement.textContent = subscriberCount;
                    subscriberElement.setAttribute('title', 'Subscriber count as displayed on YouTube');
                    subscriberElement.classList.add('youtube-count');
                }
                
                // Update video count (exact count)
                const videoCount = formatNumber(statistics.videoCount);
                const videoElement = statsContainer.querySelector('.stat-item:nth-child(2) .stat-number');
                if (videoElement) {
                    videoElement.textContent = videoCount + '+';
                }
                
                // Update view count (exact count)
                const viewCount = formatNumber(statistics.viewCount);
                const viewElement = statsContainer.querySelector('.stat-item:nth-child(3) .stat-number');
                const viewLabel = statsContainer.querySelector('.stat-item:nth-child(3) .stat-label');
                if (viewElement) {
                    viewElement.textContent = viewCount;
                }
                if (viewLabel) {
                    viewLabel.textContent = 'Total Views';
                }
                
                // Update channel creation date in the about text
                const creationDate = new Date(snippet.publishedAt);
                const year = creationDate.getFullYear();
                const aboutText = document.querySelector('#about p:nth-child(2)');
                if (aboutText) {
                    aboutText.textContent = aboutText.textContent.replace('[Year]', year);
                }
                
                // Store the data in localStorage for caching
                const cacheData = {
                    subscriberCount,
                    videoCount,
                    viewCount,
                    year,
                    timestamp: Date.now()
                };
                localStorage.setItem('channelStats', JSON.stringify(cacheData));
            }
        })
        .catch(error => {
            console.error('Error fetching channel statistics:', error);
            // Try to use cached data if available
            const cachedData = localStorage.getItem('channelStats');
            if (cachedData) {
                try {
                    const stats = JSON.parse(cachedData);
                    
                    // Only use cache if it's less than 24 hours old
                    const cacheAge = Date.now() - stats.timestamp;
                    if (cacheAge < 86400000) { // 24 hours in milliseconds
                        updateStatsFromCache(stats, statsContainer);
                    }
                } catch (e) {
                    console.error('Error parsing cached stats:', e);
                }
            }
        });
}

// Special function to format subscriber counts exactly like YouTube does
function formatYouTubeSubscriberCount(numStr) {
    const num = parseInt(numStr, 10);
    if (isNaN(num)) return '0';
    
    if (num >= 1000000) {
        // For millions: #.##M (e.g., 1.23M)
        const millions = num / 1000000;
        if (millions >= 10) {
            // For 10M+: ##M (e.g., 12M)
            return Math.floor(millions) + 'M';
        } else {
            // For 1M-10M: #.##M (e.g., 1.23M)
            return millions.toFixed(2).replace(/\.?0+$/, '') + 'M';
        }
    }
    
    if (num >= 1000) {
        // For thousands: #.##K (e.g., 1.07K)
        const thousands = num / 1000;
        if (thousands >= 10) {
            // For 10K+: ##K (e.g., 12K) or ##.#K (e.g., 12.3K)
            return thousands.toFixed(1).replace(/\.0$/, '') + 'K';
        } else {
            // For 1K-10K: #.##K (e.g., 1.07K)
            return thousands.toFixed(2).replace(/\.?0+$/, '') + 'K';
        }
    }
    
    // For less than 1000, show the exact number
    return num.toString();
}

// Function to update stats from cache
function updateStatsFromCache(stats, statsContainer) {
    const subscriberElement = statsContainer.querySelector('.stat-item:nth-child(1) .stat-number');
    if (subscriberElement) {
        subscriberElement.textContent = stats.subscriberCount;
    }
    
    const videoElement = statsContainer.querySelector('.stat-item:nth-child(2) .stat-number');
    if (videoElement) {
        videoElement.textContent = stats.videoCount + '+';
    }
    
    const viewElement = statsContainer.querySelector('.stat-item:nth-child(3) .stat-number');
    const viewLabel = statsContainer.querySelector('.stat-item:nth-child(3) .stat-label');
    if (viewElement) {
        viewElement.textContent = stats.viewCount;
    }
    if (viewLabel) {
        viewLabel.textContent = 'Total Views';
    }
    
    const aboutText = document.querySelector('#about p:nth-child(2)');
    if (aboutText && stats.year) {
        aboutText.textContent = aboutText.textContent.replace('[Year]', stats.year);
    }
}

// Example of using a proxy service
function fetchWithProxy(url) {
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    return fetch(proxyUrl + url);
}

// Hardcoded fallback data
function useHardcodedStats(statsContainer) {
    const subscriberElement = statsContainer.querySelector('.stat-item:nth-child(1) .stat-number');
    if (subscriberElement) {
        subscriberElement.textContent = '1.07K';
    }
    
    const videoElement = statsContainer.querySelector('.stat-item:nth-child(2) .stat-number');
    if (videoElement) {
        videoElement.textContent = '50+';
    }
    
    const viewElement = statsContainer.querySelector('.stat-item:nth-child(3) .stat-number');
    if (viewElement) {
        viewElement.textContent = '10K+';
    }
    
    const aboutText = document.querySelector('#about p:nth-child(2)');
    if (aboutText) {
        aboutText.textContent = aboutText.textContent.replace('[Year]', '2020');
    }
}

/* Simple, clean styling for a modest setup section */


function showFallbackVideos() {
    const videoContainer = document.getElementById('youtube-videos');
    if (!videoContainer) return;
    
    videoContainer.innerHTML = '';
    
    // Add some hardcoded videos (find actual video IDs from OrbitPlayz_'s channel)
    const videos = [
        {
            videoId: 'EXAMPLE_VIDEO_ID_1', // Replace with actual video ID from OrbitPlayz_'s channel
            title: 'Minecraft Survival Episode'
        },
        {
            videoId: 'EXAMPLE_VIDEO_ID_2', // Replace with actual video ID
            title: 'Building My Dream Base'
        },
        {
            videoId: 'EXAMPLE_VIDEO_ID_3', // Replace with actual video ID
            title: 'PvP Tournament Highlights'
        }
    ];
    
    videos.forEach(video => {
        const thumbnailUrl = `https://i.ytimg.com/vi/${video.videoId}/mqdefault.jpg`;
        
        const videoCard = document.createElement('div');
        videoCard.className = 'video-card';
        videoCard.innerHTML = `
            <div class="thumbnail" style="background-image: url('${thumbnailUrl}')">
                <div class="play-button"><i class="fas fa-play"></i></div>
            </div>
            <h3 class="video-title">${video.title}</h3>
        `;
        
        videoCard.addEventListener('click', function() {
            window.open(`https://www.youtube.com/watch?v=${video.videoId}`, '_blank');
        });
        
        videoContainer.appendChild(videoCard);
    });
    
    // Add a link to the channel
    const channelLink = document.createElement('div');
    channelLink.className = 'channel-link';
    channelLink.innerHTML = `
        <p>For more videos, visit 
        <a href="https://www.youtube.com/@OrbitPlayzOfficial" target="_blank">
            OrbitPlayz_'s YouTube channel
        </a>
        </p>
    `;
    videoContainer.appendChild(channelLink);
}

// Quick fix to show videos if API loading fails
setTimeout(function() {
    const videoContainer = document.getElementById('youtube-videos');
    if (videoContainer && videoContainer.querySelector('.loading-spinner')) {
        // If spinner is still showing after 5 seconds, show fallback videos
        const videos = [
            {
                videoId: 'EXAMPLE_VIDEO_ID_1', // Replace with actual video ID from OrbitPlayz_'s channel
                title: 'Minecraft Survival Episode'
            },
            {
                videoId: 'EXAMPLE_VIDEO_ID_2', // Replace with actual video ID
                title: 'Building My Dream Base'
            },
            {
                videoId: 'EXAMPLE_VIDEO_ID_3', // Replace with actual video ID
                title: 'PvP Tournament Highlights'
            }
        ];
        
        videoContainer.innerHTML = '';
        
        videos.forEach(video => {
            const thumbnailUrl = `https://i.ytimg.com/vi/${video.videoId}/mqdefault.jpg`;
            
            videoContainer.innerHTML += `
                <div class="video-card" onclick="window.open('https://www.youtube.com/watch?v=${video.videoId}', '_blank')">
                    <div class="thumbnail" style="background-image: url('${thumbnailUrl}')">
                        <div class="play-button"><i class="fas fa-play"></i></div>
                    </div>
                    <h3 class="video-title">${video.title}</h3>
                </div>
            `;
        });
        
        videoContainer.innerHTML += `
            <div class="channel-link">
                <p>For more videos, visit 
                <a href="https://www.youtube.com/@OrbitPlayzOfficial" target="_blank">
                    OrbitPlayz_'s YouTube channel
                </a>
                </p>
            </div>
        `;
    }
}, 5000); // Wait 5 seconds before showing fallback
