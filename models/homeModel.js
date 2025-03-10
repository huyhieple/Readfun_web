/*jslint es6:true */
"use strict";
const db = require('../config/db.js');
// const { QueryTypes } = require('sequelize');  

// ----------------------------------------------------------------------
// GET
// Get rating
const getTop10Truyen = async function () {
    try {
        const [result] = await db.execute(`
            SELECT t.idTruyen, t.name, ROUND(AVG(r.rating), 2) AS diemTB, COUNT(r.idRating) AS soDanhGia
            FROM truyen t
            JOIN rating r ON t.idTruyen = r.idTruyen
            GROUP BY t.idTruyen, t.name
            ORDER BY diemTB DESC
            LIMIT 10;
        `);
        return { success: true, message: result };
    } catch (err) {
        console.error(err);
        return { success: false, message: "Lỗi khi tìm kiếm" };
    }
};

const get12Stories = async (pageNumber) => {
    try {
        const page = parseInt(pageNumber, 10);

        // Kiểm tra tính hợp lệ của pageNumber
        if (isNaN(page) || page <= 0) {
            return { success: false, message: "Số trang không hợp lệ" };
        }

        const itemsPerPage = 12;
        const offset = (page - 1) * itemsPerPage;
        console.log('offser '+ offset);

        const sqlQuery = `
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
            GROUP BY t.idTruyen
            ORDER BY t.updated_at DESC  
            LIMIT ${itemsPerPage} OFFSET ${offset}  
        `;

        const [result] = await db.execute(sqlQuery); 

        // Kiểm tra xem có kết quả trả về không
        if (!result.length) {
            return { success: false, message: "Không có dữ liệu" };
        }

        // Trả về kết quả tìm kiếm
        return { success: true, message: result };
    } catch (err) {
        console.error(err);
        return { success: false, message: `Lỗi khi tìm kiếm: ${err.message}` };
    }
};



module.exports = {
    getTop10Truyen,
    get12Stories
};
