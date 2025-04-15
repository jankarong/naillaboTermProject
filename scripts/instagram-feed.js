document.addEventListener('DOMContentLoaded', function () {
    // Instagram API configuration
    const INSTAGRAM_TOKEN = 'cae6390075e8a3325487fa6b57ba2597';
    const POSTS_LIMIT = 16;

    async function fetchInstagramFeed() {
        try {
            // 直接使用 Instagram API 获取媒体
            const response = await fetch(
                `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${INSTAGRAM_TOKEN}&limit=${POSTS_LIMIT}`
            );

            const data = await response.json();
            console.log('API Response:', data);

            if (data.error) {
                throw new Error(data.error.message);
            }

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
        instagramFeed.innerHTML = '<div class="loading">Loading Instagram feed...</div>';

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
        } catch (error) {
            console.error('Error:', error);
            instagramFeed.innerHTML = `<div class="error">Failed to load Instagram feed: ${error.message}</div>`;
        }
    }

    initializeInstagramFeed();
}); 
