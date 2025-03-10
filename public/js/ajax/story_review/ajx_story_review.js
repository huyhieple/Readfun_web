$(document).ready(function() {
    // Lấy ID truyện từ URL
    const storyId = new URLSearchParams(window.location.search).get('id');

    // Gửi yêu cầu AJAX tới API để lấy thông tin truyện
    $.ajax({
        url: `api/searchTruyenbyID?q=${storyId}`,  // API với ID truyện
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.success && response.data.length > 0) {
                const story = response.data[0];  // Lấy thông tin truyện từ mảng dữ liệu

                // Tạo HTML để hiển thị thông tin truyện
                const storyHtml = `
                    <div class="story-detail">
                        <img src="${story.image}" alt="${story.name}" class="story-image">
                        <h1>${story.name}</h1>
                        <p><strong>Tác giả:</strong> ${story.author}</p>
                        <p><strong>Thể loại:</strong> ${story.theloai}</p>
                        <p><strong>Mô tả:</strong> ${story.description}</p>
                        <p><strong>Trạng thái:</strong> ${story.status}</p>
                        <p><strong>Số chương:</strong> ${story.amount_chapter}</p>
                    </div>
                `;

                // Thêm nội dung vào #stories-container
                $('#stories-container').html(storyHtml);
            } else {
                // Hiển thị thông báo nếu không tìm thấy dữ liệu
                $('#stories-container').html('<p>Không tìm thấy truyện này.</p>');
            }
        },
        error: function(error) {
            console.error('Lỗi khi tải dữ liệu:', error);
            $('#stories-container').html('<p>Đã xảy ra lỗi khi tải dữ liệu.</p>');
        }
    });
});
