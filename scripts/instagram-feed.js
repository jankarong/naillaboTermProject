document.addEventListener('DOMContentLoaded', function () {
    // Instagram API configuration
    // Instagram configuration
    const INSTAGRAM_APP_ID = '10032640196749456'; // PictureFeed App ID
    const INSTAGRAM_USER_ID = '17841401570704472'; // Instagram Business Account ID
    const INSTAGRAM_TOKEN = 'EAATZCPZBlkRN0BP3SLVISAh9RtIukyb9zumvZAAp52wEp0qclS3p7VLs2kuTjXVq4z7MHFzWF6CrPyaPWFnHuFocxJixg34IeTECdfn3BiEZAVaTEmmxAWNs5WzODHbEbiYSGoRHxq92mwvEhDxIQCZAweXP0e9TxTZAjBq1JoZAVGx4whXRj4YJChZAjcxqJCV6o879dbQcNcDOEhyt0r8W0NaH7KZAgfrZBiazjHaZAViw18rAwZDZD';
    const POSTS_LIMIT = 8; // Reduced initial limit for pagination

    // Store pagination data
    let nextPageUrl = null;

    async function fetchInstagramFeed(url = null) {
        try {
            // Use provided URL or construct default URL
            const apiUrl = url || `https://graph.facebook.com/v18.0/${INSTAGRAM_USER_ID}/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${INSTAGRAM_TOKEN}&limit=${POSTS_LIMIT}`;

            // 使用 Facebook Graph API 获取 Instagram 媒体
            const response = await fetch(apiUrl);

            const data = await response.json();
            console.log('API Response:', data);

            if (data.error) {
                throw new Error(data.error.message);
            }

            // Store next page URL if available
            nextPageUrl = data.paging && data.paging.next ? data.paging.next : null;

            // Return the data array directly
            return data.data || [];
        } catch (error) {
            console.error('Error fetching Instagram feed:', error);
            throw error;
        }
    }

    function createInstagramItem(post) {
        const item = document.createElement('div');
        item.className = 'instagram-item';

        if (post.media_type === 'VIDEO') {
            item.innerHTML = `
                <video
                    src="${post.media_url}"
                    muted
                    loop
                    playsinline
                    poster="${post.thumbnail_url}"
                    preload="metadata"
                >
                </video>
                <div class="instagram-overlay">
                    <div class="instagram-stats">
                        <div class="stat">
                            <i class="fas fa-external-link-alt"></i>
                            <span>View on Instagram</span>
                        </div>
                    </div>
                </div>
            `;

            const video = item.querySelector('video');

            // 创建 Intersection Observer
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    // 当视频进入视口
                    if (entry.isIntersecting) {
                        video.play();
                    } else {
                        // 当视频离开视口
                        video.pause();
                        video.currentTime = 0;
                    }
                });
            }, {
                threshold: 0.5 // 当50%的视频可见时触发
            });

            // 开始观察视频元素
            observer.observe(item);

            // 桌面端点击和移动端双击打开 Instagram
            let lastTap = 0;
            item.addEventListener('click', () => {
                if (window.matchMedia('(hover: hover)').matches) {
                    // 桌面端直接打开链接
                    window.open(post.permalink, '_blank');
                } else {
                    // 移动端检测双击
                    const currentTime = new Date().getTime();
                    const tapLength = currentTime - lastTap;
                    if (tapLength < 500 && tapLength > 0) {
                        window.open(post.permalink, '_blank');
                    }
                    lastTap = currentTime;
                }
            });
        } else {
            // 对于图片，保持原来的结构
            const imageUrl = post.media_url;
            item.innerHTML = `
                <img src="${imageUrl}" alt="${post.caption || 'Instagram post'}">
                <div class="instagram-overlay">
                    <div class="instagram-stats">
                        <div class="stat">
                            <i class="fas fa-external-link-alt"></i>
                            <span>View on Instagram</span>
                        </div>
                    </div>
                </div>
            `;

            // 图片点击直接打开 Instagram
            item.addEventListener('click', () => {
                window.open(post.permalink, '_blank');
            });
        }

        return item;
    }

    async function initializeInstagramFeed() {
        const instagramFeed = document.getElementById('instagramFeed');
        instagramFeed.innerHTML = `
            <div class="loading">
                <div class="spinner">
                    <div class="bounce1"></div>
                    <div class="bounce2"></div>
                    <div class="bounce3"></div>
                </div>
                <p>Loading Instagram feed...</p>
            </div>
        `;

        try {
            const posts = await fetchInstagramFeed();
            instagramFeed.innerHTML = '';

            if (!posts || posts.length === 0) {
                instagramFeed.innerHTML = '<div class="error">No posts found</div>';
                return;
            }

            posts.forEach(post => {
                const item = createInstagramItem(post);
                instagramFeed.appendChild(item);
            });

            // Add Load More button if there's a next page
            if (nextPageUrl) {
                addLoadMoreButton();
            }
        } catch (error) {
            console.error('Error:', error);
            instagramFeed.innerHTML = `<div class="error">Failed to load Instagram feed: ${error.message}</div>`;
        }
    }

    function addLoadMoreButton() {
        const instagramFeed = document.getElementById('instagramFeed');

        // Check if button already exists
        if (document.getElementById('loadMoreBtn')) {
            return;
        }

        // Create load more button
        const loadMoreContainer = document.createElement('div');
        loadMoreContainer.className = 'load-more-container';
        loadMoreContainer.innerHTML = `
            <button id="loadMoreBtn" class="btn btn-outline">
                <span>Load More</span>
                <i class="fas fa-chevron-down"></i>
            </button>
        `;

        instagramFeed.after(loadMoreContainer);

        // Add event listener
        document.getElementById('loadMoreBtn').addEventListener('click', async function () {
            if (!nextPageUrl) return;

            // Show loading state
            this.innerHTML = `
                <div class="spinner">
                    <div class="bounce1"></div>
                    <div class="bounce2"></div>
                    <div class="bounce3"></div>
                </div>
            `;
            this.disabled = true;

            try {
                // Fetch next page
                const morePosts = await fetchInstagramFeed(nextPageUrl);

                // Add new posts
                morePosts.forEach(post => {
                    const item = createInstagramItem(post);
                    instagramFeed.appendChild(item);
                });

                // Update button state
                if (nextPageUrl) {
                    this.innerHTML = `
                        <span>Load More</span>
                        <i class="fas fa-chevron-down"></i>
                    `;
                    this.disabled = false;
                } else {
                    // No more posts, remove button
                    loadMoreContainer.remove();
                }
            } catch (error) {
                console.error('Error loading more posts:', error);
                this.innerHTML = `Error: ${error.message}`;
                this.disabled = true;
            }
        });
    }

    initializeInstagramFeed();
});
