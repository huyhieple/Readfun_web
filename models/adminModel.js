/*jslint es6:true */
"use strict";
const db = require('../config/db.js');
// GET  -----------------------------------------------------------------------------------------------------------------------------------
// get truyen cho search 
const searchTruyen = async function (query) {
    try {
        const sqlSearch = `
            SELECT idTruyen, name, author FROM truyen 
            WHERE name LIKE ?
            LIMIT 10
        `;
        const searchQuery = `%${query}%`;
        const [rows] = await db.execute(sqlSearch, [searchQuery]);
        
        return { success: true, data: rows };
        
    } catch (err) {
        console.error(err);
        return { success: false, message: "Lỗi khi tìm kiếm", error: err.message };
    }
};
// get truyen for admin_upadate.html
const getTruyenbyID = async function ({ idTruyen }) {
    try {
        if (!idTruyen)
            return { success: false, message: "Chưa có id" };
        else {
            const sqlCheckTruyen = `SELECT * FROM truyen WHERE idTruyen = ?`;
            const [rows] = await db.execute(sqlCheckTruyen, [idTruyen]); 

            if (rows.length === 0)
                return { success: false, message: "Truyện không tồn tại" };  
            else 
                return { success: true, data: rows[0] };  
        }
    }
    catch (err) {
        console.log(err);
        return { success: false, message: 'Lỗi server khi lấy dữ liệu' };
    }
};

// UPDATE --------------------------------------------------------------------------------------------------------------------------------
const updateTruyen = async function ({ idTruyen, name, author, description, status, theloai }) {
    try {
        if (!(idTruyen && name && author && description && status && theloai))
            return { success: false, message: "Thiếu dữ liệu đầu vào!" };

        if (typeof theloai !== 'string') {
            console.log('Thể loại không hợp lệ:', theloai);
            return { success: false, message: 'Thể loại phải là chuỗi.' };
        }

        const theloaiList = theloai.split(',').map(t => t.trim());
        if (theloaiList.length === 0) {
            console.log('Danh sách thể loại rỗng.');
            return { success: false, message: 'Danh sách thể loại rỗng.' };
        }

        const placeholders = theloaiList.map(() => '?').join(', ');
        const sqlCheckTheloai = `SELECT idTheloai, type_name FROM theloai WHERE TRIM(type_name) IN (${placeholders})`;

        const connection = await db.getConnection();  // Sử dụng getConnection để lấy kết nối

        try {
            const [rows] = await connection.query(sqlCheckTheloai, theloaiList);

            if (rows.length === 0) {
                connection.release();
                return { success: false, message: 'Không tìm thấy thể loại nào trong cơ sở dữ liệu.' };
            }

            const foundTheloai = rows.map(r => r.type_name);
            const missingTheloai = theloaiList.filter(t => !foundTheloai.includes(t));
            if (missingTheloai.length > 0) {
                connection.release();
                return { success: false, message: `Thể loại không tồn tại: ${missingTheloai.join(', ')}` };
            }

            await connection.beginTransaction();  // Bắt đầu transaction

            const sqlUpdateTruyen = `
                UPDATE truyen 
                SET name = ?, author = ?, description = ?, status = ?
                WHERE idTruyen = ?
            `;
            await connection.query(sqlUpdateTruyen, [name, author, description, status, idTruyen]);

            const sqlDeleteTheloai = `DELETE FROM truyen_theloai WHERE idTruyen = ?`;
            await connection.query(sqlDeleteTheloai, [idTruyen]);

            const sqlAddTruyen_Theloai = `
                INSERT INTO truyen_theloai (idTruyen, idTheloai) VALUES ?
            `;
            const truyenTheloaiValues = rows.map(r => [idTruyen, r.idTheloai]);
            await connection.query(sqlAddTruyen_Theloai, [truyenTheloaiValues]);

            await connection.commit();  // Hoàn tất transaction
            connection.release();  // Giải phóng kết nối

            return { success: true, message: 'Cập nhật truyện thành công!' };
        } catch (err) {
            connection.release();  // Giải phóng kết nối
            console.log('Lỗi khi cập nhật truyện:', err);
            return { success: false, message: 'Lỗi server khi cập nhật' };
        }
    } catch (err) {
        console.log('Lỗi khi tạo kết nối:', err);
        return { success: false, message: 'Lỗi server khi tạo kết nối' };
    }
};


// ADD ----------------------------------------------------------------------------------------------------------------------------------
// Logic để thêm chapter cho truyện đã tạo 
const addChapter = async function ({ chapterNumber, idTruyen, noidung, chapterTitle }) {
    try {
        // Kiểm tra dữ liệu đầu vào
        if (!chapterNumber || !idTruyen || !noidung || !chapterTitle) {
            return { success: false, message: 'Thiếu dữ liệu bắt buộc!' };
        }

        // Kiểm tra truyện có tồn tại không
        const sqlCheckTruyen = `SELECT idTruyen FROM truyen WHERE idTruyen = ?`;
        const [rows] = await db.execute(sqlCheckTruyen, [idTruyen]);

        if (rows.length === 0) {
            return { success: false, message: 'Không tìm thấy truyện với id đã cho.' };
        }

        // Thêm chapter vào database
        const sqlAddChapter = `
            INSERT INTO chapter (chapterNumber, idTruyen, noidung, chapterTitle)
            VALUES (?, ?, ?, ?)
        `;
        await db.execute(sqlAddChapter, [chapterNumber, idTruyen, noidung, chapterTitle]);
        return { success: true, message: 'Thêm chapter thành công!' };
        
    } catch (err) {
        console.error('Lỗi khi thêm chapter:', err);
        return { success: false, message: 'Lỗi server khi thêm chapter'};  // error: err.message 
    }
};

// Hàm thêm truyện
const addTruyen = async function ({ name, author, description, status, image, theloai }) {
    try {
        // Kiểm tra theloai có phải chuỗi không
        if (typeof theloai !== 'string') {
            console.log('Thể loại không hợp lệ:', theloai);
            return { success: false, message: 'Thể loại phải là chuỗi.' };
        }

        // Tách thể loại thành mảng
        const theloaiList = theloai.split(',').map(t => t.trim());
        if (theloaiList.length === 0) {
            console.log('Danh sách thể loại rỗng.');
            return { success: false, message: 'Danh sách thể loại rỗng.' };
        }
        // console.log(theloaiList);

        // Tạo placeholders với khoảng trắng sau dấu phẩy
        const placeholders = theloaiList.map(() => '?').join(', ');
        console.log(placeholders);
        const sqlCheckTheloai = `SELECT idTheloai, type_name FROM theloai WHERE TRIM(type_name) IN (${placeholders})`;
        const [rows] = await db.query(sqlCheckTheloai, theloaiList);

        // console.log('Kết quả kiểm tra thể loại:', result);

        // Kiểm tra nếu không tìm thấy thể loại
        if (rows.length === 0) {
            return { success: false, message: 'Không tìm thấy thể loại nào trong cơ sở dữ liệu.' };
        }
        const foundTheloai = rows.map(r => r.type_name);
        const missingTheloai = theloaiList.filter(t => !foundTheloai.includes(t));

        if (missingTheloai.length > 0) {
            return { success: false, message: `Thể loại không tồn tại: ${missingTheloai.join(', ')}` };
        }

        // Thêm truyện vào bảng `truyen`
        const sqlAddTruyen = `
            INSERT INTO truyen (name, author, description, status, image)
            VALUES (?, ?, ?, ?, ?)
        `;
        const insertResult = await db.execute(sqlAddTruyen, [name, author, description, status, image]);
        const idTruyenInserted = insertResult[0].insertId;  // Lấy ID truyện vừa thêm

        // Thêm thể loại cho truyện vào bảng `truyen_theloai`
        const sqlAddTruyen_Theloai = `
            INSERT INTO truyen_theloai (idTruyen, idTheloai) VALUES ?
        `;
        const truyenTheloaiValues = rows.map(r => [idTruyenInserted, r.idTheloai]);
        await db.query(sqlAddTruyen_Theloai, [truyenTheloaiValues]);
        return { success: true, message: 'Thêm truyện thành công!' };
    } 
    catch (err) {
        console.error('Lỗi khi thêm truyện:', err);
        return { success: false, message: 'Không thể thêm truyện.' };
    }
};



const addTheloai = async function ({ type_name }) {
    try {
        // Kiểm tra nếu không có type_name
        if (!type_name) {
            return { success: false, message: "Bạn chưa điền thể loại" };
        }

        // Câu lệnh SQL để thêm thể loại mới
        const sqlInsertType = `
            INSERT INTO theloai (type_name)
            VALUES (?)
        `;

        // Thực thi câu lệnh thêm thể loại
        const [result] = await db.execute(sqlInsertType, [type_name]);

        // Kiểm tra kết quả insert
        if (result.affectedRows === 0) {
            return { success: false, message: "Lỗi khi thêm thể loại" };
        }

        return { success: true, message: "Thêm thể loại thành công" };

    } catch (err) {
        console.error('Lỗi khi thêm thể loại:', err);
        return { success: false, message: "Lỗi server khi thêm thể loại", error: err.message };
    }
};

module.exports = {
    searchTruyen,
    addTruyen,
    addTheloai,
    addChapter,
    getTruyenbyID,
    updateTruyen
};
// const addTruyen = (req, res) => {
//     const {name, author, description, status, image, theloai } = req.body;
//     // Kiểm tra các trường bắt buộc khác rỗng
//     if (!name || !author || !description || !status || !theloai) {
//         return res.status(400).send('Thiếu dữ liệu bắt buộc!');
//     } 
//     else {
//         // Kiểm tra xem thể loại có tồn tại trong bảng theloai không
//         const sqlCheckTheloai = `SELECT idTheloai FROM theloai WHERE type_name = ?`;
//         db.query(sqlCheckTheloai, [theloai], (err, rows) => {
//             if (err) {
//                 console.log(err);
//                 return res.status(500).send('Lỗi khi kiểm tra thể loại!');
//             } 
//             else {
//                 // Nếu thể loại không tồn tại
//                 if (rows.length === 0) {
//                     return res.status(400).send('Thể loại không tồn tại!');
//                 } 
//                 else {
//                     // Nếu thể loại tồn tại, lấy idTheloai
//                     const idTheloai = rows[0].idTheloai;

//                     // Câu lệnh SQL để thêm truyện
//                     const sqlAddTruyen = `
//                         INSERT INTO truyen (name, author, description, status, image)
//                         VALUES (?, ?, ?, ?, ?)
//                     `;
//                     db.query(sqlAddTruyen, [name, author, description, status, image], (err, result) => {
//                         if (err) {
//                             console.log(err);
//                             return res.status(500).send('Lỗi khi thêm truyện!');
//                         } 
//                         else {
//                             const idTruyenInserted = result.insertId;  // Lấy id của truyện vừa thêm
//                             console.log(result);  // -------------------------------------------------------------------
//                             // Thêm thể loại vào bảng truyen_theloai
//                             const sqlAddTruyen_Theloai = `
//                                 INSERT INTO truyen_theloai (idTruyen, idTheloai)
//                                 VALUES (?, ?)
//                             `;
//                             db.query(sqlAddTruyen_Theloai, [idTruyenInserted, idTheloai], (err) => {
//                                 if (err) {
//                                     console.log(err);
//                                     return res.status(500).send('Lỗi khi thêm thể loại cho truyện!');
//                                 } else {
//                                     return res.send('Thành công!');
//                                 }
//                             });
//                         }
//                     });
//                 }
//             }
//         });
//     }
// };

// const addChapter = (req,res) => {
//     const { chapterNumber, idTruyen, noidung, chapterTitle } = req.body;  // Lấy dữ liệu từ req.body
//     if (!chapterNumber || !idTruyen || !noidung || !chapterTitle ) {
//         return res.status(400).send('Thiếu dữ liệu bắt buộc!');
//     }
//     else {
//         const sqlCheckTruyen = `SELECT idTruyen FROM truyen WHERE idTruyen = ?`;
//         db.query(sqlCheckTruyen,[idTruyen], (err, result) => {
//             if (err) {
//                 console.log(err);
//                 return res.status(500).send('Lỗi server');
//             }
//             else {
//                 if (result.length === 0)
//                 {
//                     return res.status(400).send('Lỗi không có truyện trước đó');
//                 }
//                 else
//                 {
//                     const sqlAddChapter = `INSERT INTO chapter (chapterNumber, idTruyen, noidung, chapterTitle) VALUES (?,?,?,?)`;
//                     db.query(sqlAddChapter,[chapterNumber, idTruyen, noidung, chapterTitle], (err) => {zsaqqaa
//                         if (err) 
//                         {
//                            return res.status(500).send('Lỗi server');
//                         }
//                         else
//                         {
//                             return res.send('Thành công');
//                         }
//                     });
//                 }
//             }
//         });
//     }
// };

