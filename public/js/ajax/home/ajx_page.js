$(document).ready(function() {
    // Lấy các nút và khung chứa dữ liệu
    const $prevBtn = $('#prev-btn');
    const $nextBtn = $('#next-btn');
    const $storiesContainer = $('#stories-container');

    // Hàm để tải dữ liệu truyện và cập nhật giao diện
    const loadStories = (pageNumber) => {
        $.ajax({
            url: `home/page/${pageNumber}`,  // Gửi yêu cầu GET đến server
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                if (data.success === false) {
                    $storiesContainer.html(data.message);  // Nếu không có dữ liệu, hiển thị thông báo
                } else {
                    // Hiển thị dữ liệu truyện trong container theo dạng lưới
                    const storiesHtml = data.message.map(story => `
                        <a href="/story_review.html?id=${story.idTruyen}" class="story-link">
                            <div class="story">
                                <img src="${story.image}" alt="${story.name}">
                                <h2>${story.name}</h2>
                                <p>Tác giả: ${story.author}</p>
                                <p>Status: ${story.status}</p>
                            </div>
                        </a>
                    `).join('');
                    $storiesContainer.html(storiesHtml);  // Cập nhật nội dung truyện
                }
            },
            error: function(error) {
                console.error('Lỗi khi tải dữ liệu:', error);
                $storiesContainer.html('Có lỗi xảy ra khi tải dữ liệu.');
            }
        });
    };

    // Lắng nghe sự kiện nhấn nút Previous
    $prevBtn.on('click', function() {
        const currentPage = parseInt($prevBtn.data('page'));
        if (currentPage > 1) {
            const newPage = currentPage - 1;
            $prevBtn.data('page', newPage);
            $nextBtn.data('page', newPage + 1);
            loadStories(newPage);  // Tải dữ liệu cho trang mới

            // Cuộn lên đầu trang
            $('html, body').animate({ scrollTop: 0 }, 'fast');
        }
    });

    // Lắng nghe sự kiện nhấn nút Next
    $nextBtn.on('click', function() {
        const currentPage = parseInt($nextBtn.data('page'));
        const newPage = currentPage + 1;
        $prevBtn.data('page', newPage - 1);
        $nextBtn.data('page', newPage);
        loadStories(newPage);  // Tải dữ liệu cho trang mới

        // Cuộn lên đầu trang
        $('html, body').animate({ scrollTop: 0 }, 'fast');
    });

    // Tải trang đầu tiên khi lần đầu tiên tải trang
    loadStories(1);
});
