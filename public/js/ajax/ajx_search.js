$('#search-input').on('keyup', function() {
    const query = $(this).val().trim();
    console.log('query: ' + query);

    if (query.length === 0) {
        $('#search-results').html('').hide();  // Xóa kết quả nếu không có query
        return;
    }

    $.ajax({
        url: '/api/search',
        method: 'GET',
        data: { q: query },
        success: function(data) {
            if (data.success && data.data.length > 0) {  // Có kết quả trả về
                let html = '<ul>';  // Bọc bằng <ul> để hợp chuẩn
                data.data.forEach(truyen => {
                    html += `
                        <li class="theloai-item search-item" data-id="${truyen.idTruyen}">
                            ${truyen.name} - ${truyen.author}
                        </li>`;
                });
                html += '</ul>';
                $('#search-results').html(html).show();  // Đổ dữ liệu vào #search-results
            } else {  // Không có kết quả
                $('#search-results').html('').hide();
            }
        },
        error: function() {
            $('#search-results').html('<div class="error-message">Lỗi khi tìm kiếm</div>').show();  // Thông báo lỗi
        }
    }); 
});

// Bắt sự kiện click vào item tìm kiếm
$('#search-results').on('click', '.search-item', function() {
    const idTruyen = $(this).data('id');
    console.log("ID truyện được chọn:", idTruyen);  // Log để kiểm tra

    // Gọi AJAX lấy dữ liệu chi tiết truyện với query parameter `q`
    $.get(`/api/searchTruyenbyID`, { q: idTruyen }, function(data) {
        console.log("Dữ liệu nhận được:", data);  // Log để kiểm tra

        // Kiểm tra nếu có dữ liệu trả về và không rỗng
        if (data.success && data.data.length > 0) {
            const truyen = data.data[0];  // Lấy phần tử đầu tiên của mảng
            
            $('#author').val(truyen.author);
            $('#theloai').val(truyen.theloai);
            $('#description').val(truyen.description);
            $('#status').val(truyen.status);
            $('#name').val(truyen.name);
            $('#truyenImage').attr('src', truyen.image);

            // Lưu dữ liệu ban đầu để so sánh sau này
            window.originalData = truyen;
        } else {
            console.log("Không có dữ liệu cho truyện này.");
        }
    });
});


