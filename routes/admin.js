var express = require("express");
var router = express.Router();
var bodyParser = require('body-parser');
const adminController = require('../controllers/adminController.js');

// Cấu hình body-parser để lấy dữ liệu từ form
router.use(bodyParser.urlencoded({ extended: true }));   // extended true để lấy dữ liệu phức tạp từ form (lồng nhau) và cho data gửi ở dạng form application/x-www-form-urlencoded   
router.use(bodyParser.json());

// API để thêm chapter cho truyện đã tạo 
// router.post('/addChapter', adminController.addChapter);
router.post('/addTruyen', adminController.upload.single('image'), adminController.addTruyen);
router.post('/addTheloai', adminController.addTheloai);
router.post('/addChapter', adminController.addChapter);
router.get('/getTruyen/:idTruyen', adminController.getTruyen);
router.post('/updateTruyenbyID', adminController.updateTruyen);
module.exports = router;