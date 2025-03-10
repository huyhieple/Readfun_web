/*jslint es6:true */
"use strict";
const db = require('../config/db.js');
// GET  -----------------------------------------------------------------------------------------------------------------------------------
// get truyen cho search 


const getChaptersByTruyenIdAndChapterId = async function(idTruyen, idChapter) {
    try {
        const sqlQuery = `
            SELECT 
                c.chapterNumber, 
                c.chapterTitle, 
                c.noidung, 
                c.createdAt, 
                c.updatedAt
            FROM chapter c
            WHERE c.idTruyen = ? AND c.chapterNumber = ?
        `;
        
        // Thực thi câu lệnh SQL
        const [rows] = await db.execute(sqlQuery, [idTruyen, idChapter]);
        
        if (rows.length === 0) {
            return { success: false, message: "Không tìm thấy chương" };
        }
        
        return { success: true, data: rows };
        
    } catch (err) {
        console.error(err);
        return { success: false, message: "Lỗi khi truy vấn dữ liệu chương" };
    }
};

const searchTruyenbyID = async function (query) {
    try {
        const sqlSearch = `
            SELECT 
                t.idTruyen, 
                t.name, 
                t.author, 
                t.description, 
                t.status, 
                t.amount_chapter, 
                t.image,
            GROUP_CONCAT(th.type_name SEPARATOR ', ') AS theloai  
            FROM truyen t
            LEFT JOIN truyen_theloai tt ON t.idTruyen = tt.idTruyen  
            LEFT JOIN theloai th ON tt.idTheloai = th.idTheloai        
            WHERE t.idTruyen = ?
            GROUP BY t.idTruyen  -- Gom nhóm theo từng truyện `;

        const [rows] = await db.execute(sqlSearch, [query]);
        
        return { success: true, data: rows };
        
    } catch (err) {
        console.error(err);
        return { success: false, message: "Lỗi khi tìm kiếm" };
    }
};
const searchTruyen = async function (query) {
    try {
        const sqlSearch = `
            SELECT 
                t.idTruyen, 
                t.name, 
                t.author, 
                t.description, 
                t.status, 
                t.amount_chapter, 
                t.image,
            GROUP_CONCAT(th.type_name SEPARATOR ', ') AS theloai  -- Lấy tên thể loại, ngăn cách bởi dấu phẩy
            FROM truyen t
            LEFT JOIN truyen_theloai tt ON t.idTruyen = tt.idTruyen   -- JOIN bảng trung gian
            LEFT JOIN theloai th ON tt.idTheloai = th.idTheloai        -- JOIN bảng thể loại để lấy tên
            WHERE t.name LIKE ?
            GROUP BY t.idTruyen  -- Gom nhóm theo từng truyện `;

        const searchQuery = `%${query}%`;
        const [rows] = await db.execute(sqlSearch, [searchQuery]);
        
        return { success: true, data: rows };
        
    } catch (err) {
        console.error(err);
        return { success: false, message: "Lỗi khi tìm kiếm" };
    }
};

const searchTheloai = async function (query) {
    try {
        const sqlSearch = `
            SELECT idTheloai, type_name FROM theloai 
            WHERE type_name LIKE ? 
        `;
        const searchQuery = `%${query}%`;
        console.log('searchQuery:', searchQuery);

        const [rows] = await db.execute(sqlSearch, [searchQuery]);
        console.log('row ' + rows);
        return { success: true, data: rows };
        
    } catch (err) {
        console.error(err);
        return { success: false, message: "Lỗi khi tìm kiếm thể loại"};
    }
}

module.exports = {
    searchTruyen,
    searchTheloai,
    searchTruyenbyID,
    getChaptersByTruyenIdAndChapterId
}