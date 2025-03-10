var express = require("express");
var router = express.Router();
var bodyParser = require('body-parser');
const homeController = require('../controllers/homeController.js');

// Cấu hình body-parser để lấy dữ liệu từ form
router.use(bodyParser.urlencoded({ extended: true }));   // extended true để lấy dữ liệu phức tạp từ form (lồng nhau) và cho data gửi ở dạng form application/x-www-form-urlencoded   
router.use(bodyParser.json());

//route
router.get('/page/:pageNumber', homeController.get12Stories); 
router.get('/top10Truyen', homeController.getTop10Truyen);
router.get('', )
module.exports = router;
