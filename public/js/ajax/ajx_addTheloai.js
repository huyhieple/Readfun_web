$('#add-theloai-btn').on('click', function() {
    const newTheloai = $('#new-theloai').val().trim();  // Lấy giá trị từ ô input
    console.log('Thể loại mới: ' + newTheloai);  // Kiểm tra giá trị

    if (newTheloai.length === 0) {
        // alert('Vui lòng nhập thể loại mới!');
        return;
    }

    // Gọi AJAX POST để thêm thể loại mới
    $.ajax({
        url: '/admin/addTheloai',  // API thêm thể loại mới
        method: 'POST',
        contentType: 'application/json',  // Xác định kiểu dữ liệu gửi đi là JSON
        data: JSON.stringify({ type_name: newTheloai }),  // Chuyển dữ liệu sang dạng JSON
        success: function(data) {
            if (data.success) {  // Nếu thêm thành công
                $('#add-result').text('Thêm thể loại thành công!').css('color', '#28a745').show();
                $('#new-theloai').val('');  // Xóa nội dung ô input sau khi thêm
            } else {  // Nếu lỗi phía server
                $('#add-result').text('Thể loại đã tồn tại!').css('color', '#dc3545').show();
            }
        },
        error: function() {  // Lỗi kết nối server
            $('#add-result').text('Lỗi khi thêm thể loại!').css('color', '#dc3545').show();
        }
    });
});
