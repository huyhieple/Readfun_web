const Truyen = require('../models/adminModel.js');

const slugify = require('slugify');  // Xử lý đường dẫn 
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// UPDATE 
const updateTruyen = async (req,res) => {
    const {idTruyen, name, author, description, status, theloai } = req.body;
    console.log({idTruyen, name, author, description, status, theloai });
    try {
        const result = await Truyen.updateTruyen({ idTruyen, name, author, description, status, theloai });
        if (result.success)
            res.status(200).send(result);
        else
            res.status(400).send(result);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Lỗi update');
    }
}
//GET  -----------------------------------------------------------------------------------


// get Truyện for admin_update.html
const getTruyen = async (req,res) => {
    // console.log(req.params);  

    const {idTruyen} = req.params;
    // console.log(idTruyen);
    try {
        const result = await Truyen.getTruyenbyID({idTruyen});
        if (result.success)
            res.status(200).send(result);
        else
            res.status(400).send(result);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Lỗi khi lấy dữ liệu');
    }
}

// Cấu hình multer để xử lý file upload
const upload = multer({ dest: 'image/' });          

// Hàm thêm thể loại 
const addTheloai = async (req,res) => {
    const { type_name } = req.body;
    try {
        result = await Truyen.addTheloai ({type_name});
        if (result.success)
            res.status(200).send(result);
        else
            res.status(400).send('Lỗi');
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Lỗi khi thêm truyện');
    }
}
// Hàm thêm truyện
const addTruyen = async (req, res) => {
    const { name, author, theloai, description, status  } = req.body;
    const file = req.file;

    if (!file) {
        return res.status(400).send('Thiếu ảnh!');
    }

    // Tạo tên tệp hình ảnh từ name
    const fileExtension = path.extname(file.originalname); // Lấy phần mở rộng của tệp
    const sanitizedFileName = slugify(name); // Tạo tên tệp hợp lệ từ name
    const imagePath = `/image/${sanitizedFileName}${fileExtension}`; // Đường dẫn hình ảnh
    const savePath = path.join(__dirname, '..', 'image', `${sanitizedFileName}${fileExtension}`); // Đường dẫn lưu tệp

    // Đổi tên và lưu tệp
    fs.renameSync(file.path, savePath); // Đổi tên và lưu tệp với tên mới

    try {
        result = await Truyen.addTruyen({ name, author, description, status, image: imagePath, theloai });
        //Thong bao
        // Kiểm tra kết quả và trả về cho client
        if (result.success) {
            res.status(200).send(result); // Trả về thông báo thành công
        } else {
            res.status(400).send('Lỗi'); 
        }
    
    } catch (err) {
        console.error(err);
        res.status(500).send('Lỗi khi thêm truyện');
    }
};
// Thêm Chapter
const addChapter = async (req, res) => {
    try {
        const { chapterNumber, idTruyen, noidung, chapterTitle } = req.body;
        const result = await Truyen.addChapter({ chapterNumber, idTruyen, noidung, chapterTitle });
        if (result.success)
            res.status(200).send(result);
        else
            res.status(400).send('Lỗi')
        }
    catch (err)
    {
            console.error(err);
            res.status(500).send('Lỗi khi thêm Chapter');
    }
}

// Export `upload` và `addTruyen` để `router` gọi
module.exports = {
    upload,
    addTruyen,
    addTheloai,
    addChapter,
    getTruyen,
    updateTruyen
};


// // Sửa truyện
// const editTruyen = async (req, res) => {
//     const { idTruyen, name, author, description, status, amount_chapter } = req.body;
//     const image = req.file ? req.file.filename : null;

//     try {
//         await Truyen.updateTruyen(idTruyen, { name, author, description, status, amount_chapter, image });
//         res.redirect('/admin/truyen');
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Lỗi khi sửa truyện');
//     }
// };

// // Xóa truyện
// const deleteTruyen = async (req, res) => {
//     const { idTruyen } = req.body;

//     try {
//         await Truyen.deleteTruyen(idTruyen);
//         res.redirect('/admin/truyen');
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Lỗi khi xóa truyện');
//     }
// };

// , editTruyen, deleteTruyen
