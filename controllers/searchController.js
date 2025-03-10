const Truyen = require('../models/searchModel.js');


// Route để lấy thông tin chương theo idTruyen và idChapter
const searchChapter = async (req, res) => {
    const { idTruyen, idChapter } = req.query;

    // Kiểm tra nếu thiếu tham số idTruyen hoặc idChapter
    if (!idTruyen || !idChapter) {
        return res.status(400).json({ success: false, message: "Thiếu thông tin idTruyen hoặc idChapter" });
    }

    // Gọi hàm từ model để lấy thông tin chương
    try {
        const result = await Truyen.getChaptersByTruyenIdAndChapterId(idTruyen, idChapter);
        
        if (result.success) {
            // Nếu có dữ liệu, trả về dữ liệu chương
            return res.json(result);
        } else {
            // Nếu không tìm thấy dữ liệu, trả về thông báo lỗi
            return res.status(404).json(result);
        }
    } catch (err) {
        console.error("Lỗi khi truy vấn chương:", err);
        return res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
};


// Search Truyện 
const searchTruyenbyID = async (req, res) => {
    const query = req.query.q;

    if (!query || query.trim().length === 0) {
        return res.status(400).json({ success: false, message: 'Chưa nhập từ khóa tìm kiếm' });
    }

    try {
        const result = await Truyen.searchTruyenbyID(query);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Lỗi server khi tìm kiếm' });
    }
};
const searchTruyen = async (req, res) => {
    const query = req.query.q;

    if (!query || query.trim().length === 0) {
        return res.status(400).json({ success: false, message: 'Chưa nhập từ khóa tìm kiếm' });
    }

    try {
        const result = await Truyen.searchTruyen(query);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Lỗi server khi tìm kiếm' });
    }
};
const searchTheloai = async (req,res) => {
    const query = req.query.q;
    // console.log(query);
    if (!query || query.trim().length === 0) {
        return res.status(400).json({ success: false, message: 'Chưa nhập từ khóa tìm kiếm' });
    }
    try {
        const result = await Truyen.searchTheloai(query);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Lỗi server khi tìm kiếm' });
    }
}
module.exports = {
    searchTruyen,
    searchTheloai,
    searchTruyenbyID,
    searchChapter
}

