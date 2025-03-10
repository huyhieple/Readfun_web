$('#search-input').on('keyup', function() {
    const query = $(this).val().trim();
    console.log('query: ' + query);

    if (query.length === 0) {
        $('#search-results').html('').hide();  // Ẩn khi không có kết quả
        return;
    }

    // Gọi AJAX để tìm kiếm thể loại
    $.ajax({
        url: '/api/searchTheloai',  // API tìm kiếm thể loại
        method: 'GET',
        data: { q: query },
        success: function(data) {
            if (data.success && data.data.length > 0) {  // Có kết quả trả về
                let html = '';
                data.data.forEach(theloai => {
                    // Hiển thị danh sách thể loại phù hợp
                    html += `
                        <div class="theloai-item">
                            ${theloai.type_name}
                        </div>`;
                });
                $('#search-results').html(html).show();  // Hiển thị khi có kết quả
            } 
        },
        error: function() {
            $('#search-results').html('<div>Lỗi khi tìm kiếm</div>').show();  // Hiển thị lỗi kết nối
        }
    });
});

// Khi người dùng nhấp vào thể loại
$('#search-results').on('click', '.theloai-item', function() {
    const selectedTheloai = $(this).text().trim();
    const currentTheloai = $('#theloai').val().trim();

    if (currentTheloai === '') {
        // Nếu ô trống thì thêm thể loại mới
        $('#theloai').val(selectedTheloai);
    } else if (!currentTheloai.includes(selectedTheloai)) {
        // Nếu ô đã có thể loại và không chứa thể loại mới thì thêm với dấu phẩy
        $('#theloai').val(currentTheloai + ', ' + selectedTheloai);
    }
});