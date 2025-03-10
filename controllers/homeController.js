const home = require('../models/homeModel.js');

const getTop10Truyen = async (req, res) => {
    try {
        let result = await home.getTop10Truyen();  // Dùng await để chờ kết quả từ DB
        if (result.success) {
            res.send(result);
        } else {
            res.status(400).send(result);
        }
    } catch (err) { 
        console.error(err);
        res.status(500).send('Lỗi server');
    }
};


// Hàm xử lý lấy dữ liệu cho trang home với phân trang
const get12Stories = async (req, res) => {
    const pageNumber = parseInt(req.params.pageNumber) || 1;
    console.log('page: '+ pageNumber);
    try {
        // Gọi hàm từ model để lấy dữ liệu
        const result = await home.get12Stories(pageNumber);
        res.send(result);       
    } catch (error) {
        console.error(error);
        res.status(500).send('Lỗi khi lấy dữ liệu');
    }
};
module.exports = { getTop10Truyen, get12Stories };
