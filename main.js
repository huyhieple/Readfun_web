/*jslint es6:true */
"use strict";

var express = require ("express");
var app = express();
var bodyParser = require('body-parser');
var path = require('path');

var routeAdmin = require('./routes/admin.js');
var searchAPI = require('./controllers/searchController.js');
var routeHome = require('./routes/home.js');
// Cấu hình middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Để server có thể phục vụ ảnh trong thư mục /image
app.use('/image', express.static('image'));
// Cho phép truy cập các file tĩnh trong thư mục 'public'
app.use(express.static('public'))


// GET
app.get('/admin/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/view/', 'admin.html'));                 // Khi truy cập '/admin', gửi file 'admin.html' về trình duyệt
}); 

app.get('/admin/admin_update.html', (req,res) => {
    res.sendFile(path.join(__dirname, 'public/view/', 'admin_update.html'));    
})

app.get('/home.html', (req,res) => {
    res.sendFile(path.join(__dirname, 'public/view/', 'home.html'));    
})

app.get('/story_review.html', (req,res) => {
    res.sendFile(path.join(__dirname, 'public/view/', 'story_review.html'));    
})

app.get('/read.html', (req,res) => {
    res.sendFile(path.join(__dirname, 'public/view/', 'read.html'));    
})

app.get('/api/search', searchAPI.searchTruyen);
app.get('/api/searchTheloai', searchAPI.searchTheloai);
app.get('/api/searchTruyenbyID', searchAPI.searchTruyenbyID);
app.get('/api/searchChapter', searchAPI.searchChapter);

// app.use('/truyen', routeTruyen);
app.use('/admin', routeAdmin);
app.use('/home', routeHome);


module.exports=app;