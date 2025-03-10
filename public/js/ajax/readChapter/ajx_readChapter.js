$(document).ready(function() {
    const params = new URLSearchParams(window.location.search);
    const idTruyen = params.get('idTruyen');
    let idChapter = parseInt(params.get('idChapter'));  // Đảm bảo idChapter là số

    console.log(idTruyen + ' ' + idChapter);

    // Hàm tải dữ liệu chương
    function loadChapter(idTruyen, idChapter) {
        $.ajax({
            url: `/api/searchChapter?idTruyen=${idTruyen}&idChapter=${idChapter}`,
            method: 'GET',
            dataType: 'json',
            success: function(response) {
                console.log("Dữ liệu chương:", response);
                const { chapterNumber, chapterTitle, noidung } = response.data[0];

                // Hiển thị dữ liệu chương trên giao diện
                $("#chapter-title").text(`Chương ${chapterNumber}: ${chapterTitle}`);
                $("#chapter-content").html(noidung);
            },
            error: function(error) {
                console.error('Lỗi khi tải dữ liệu:', error);
            }
        });
    }

    // Tải chương hiện tại
    loadChapter(idTruyen, idChapter);

    // Xử lý sự kiện khi nhấn nút "Trước"
    $("#previous").click(function() {
        if (idChapter > 1) {  // Giới hạn không cho về chương số 0
            idChapter--;
            window.location.href = `read.html?idTruyen=${idTruyen}&idChapter=${idChapter}`;
        } 
    });

    // Xử lý sự kiện khi nhấn nút "Sau"
    $("#next").click(function() {
        idChapter++;
        window.location.href = `read.html?idTruyen=${idTruyen}&idChapter=${idChapter}`;
    });
});
