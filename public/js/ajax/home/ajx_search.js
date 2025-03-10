$(document).ready(function() {
    const $searchInput = $('#search-input');
    const $searchDropdown = $('#search-dropdown');

    // Hàm gọi API khi người dùng nhập vào ô tìm kiếm
    $searchInput.on('input', function() {
        const query = $searchInput.val().trim().toLowerCase();
        $searchDropdown.empty();  // Xóa các mục cũ
        // console.log('que'+query);
        if (query) {
            $.ajax({
                url: `/api/search`,
                method: 'GET',
                data: { q: query },
                success: function(response) {
                    if (response.success && response.data.length > 0) {
                        response.data.forEach(truyen => {
                            const listItem = `
                                <li class="search-item">
                                    <img src="${truyen.image}" alt="${truyen.name}" class="item-image">
                                    <div class="info">
                                        <span class="title">${truyen.name}</span>
                                        <span class="author">Tác giả: ${truyen.author}</span>
                                    </div>
                                </li>`;
                            $searchDropdown.append(listItem);
                        });
                        $searchDropdown.show();  // Hiển thị dropdown nếu có kết quả
                    } else {
                        $searchDropdown.hide();  // Ẩn nếu không có kết quả
                    }
                },
                error: function(err) {
                    console.error('Lỗi khi gọi API:', err);
                    $searchDropdown.hide();
                }
            });
        } else {
            $searchDropdown.hide();  // Ẩn nếu không có từ khóa
        }
    });

    // Sự kiện khi chọn 1 truyện từ dropdown
    $(document).on('click', '.search-item', function() {
        const selectedName = $(this).find('.title').text();
        $searchInput.val(selectedName);
        $searchDropdown.hide();  // Ẩn dropdown khi chọn
    });

    // Ẩn menu thả xuống khi nhấp ra ngoài
    $(document).click(function(e) {
        if (!$(e.target).closest('.search-container').length) {
            $searchDropdown.hide();
        }
    });
});
