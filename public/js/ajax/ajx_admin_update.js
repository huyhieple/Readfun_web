$(document).ready(function() {
    // Submit cập nhật
    $('#updateBtn').click(function() {
        const updatedData = {
            idTruyen: originalData.idTruyen,  
            name: $('#name').val(),
            author: $('#author').val(),
            theloai: $('#theloai').val(),
            description: $('#description').val(),
            status: $('#status').val()
        };

        if (JSON.stringify(updatedData) === JSON.stringify(originalData)) {
            alert('Chưa có thay đổi');
            return;
        }

        $.ajax({
            url: '/admin/updateTruyenbyID',
            method: 'POST',
            dataType: 'json',  // Nhận JSON từ server
            contentType: 'application/json',
            data: JSON.stringify(updatedData),
            success: function(response) {
                if (response.success)
                {
                    // Hiển thị box thành công
                    $('body').append(`
                        <div id="successBox" style="position: fixed; inset: 0; background-color: rgba(0, 0, 0, 0.5); z-index: 9999; display: flex; align-items: center; justify-content: center;">
                            <div style="background-color: white; padding: 20px; border-radius: 10px; text-align: center; box-shadow: 0 0 10px rgba(0,0,0,0.3);">
                                <h2 style="margin-bottom: 15px;">Cập nhật thành công!</h2>
                                <button id="closeBox" style="background-color: #3B82F6; color: white; padding: 5px 10px; border: none; border-radius: 5px; cursor: pointer;">OK</button>
                            </div>
                        </div>
                    `);
                    
                        // Đóng box khi nhấn OK
                    $('#closeBox').click(function() {
                       $('#successBox').remove();
                    });
                }
                else {
                       $('body').append(`
                        <div id="successBox" style="position: fixed; inset: 0; background-color: rgba(0, 0, 0, 0.5); z-index: 9999; display: flex; align-items: center; justify-content: center;">
                            <div style="background-color: white; padding: 20px; border-radius: 10px; text-align: center; box-shadow: 0 0 10px rgba(0,0,0,0.3);">
                                <h2 style="margin-bottom: 15px;">Cập nhật thất bại!</h2>
                                <button id="closeBox" style="background-color: #3B82F6; color: white; padding: 5px 10px; border: none; border-radius: 5px; cursor: pointer;">OK</button>
                            </div>
                        </div>
                    `);
                        // Đóng box khi nhấn OK
                    $('#closeBox').click(function() {
                       $('#successBox').remove();
                    });
                }
            },
            error: function(err) {
                alert('Lỗi khi cập nhật!');
            }
        });
    });
});  
