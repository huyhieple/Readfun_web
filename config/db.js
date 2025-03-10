// Kết nối với MySQL ----------------------------------------------
// const mysql = require("mysql2");
const mysql = require('mysql2/promise');

// Tạo kết nối
// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "Lhh37440123.",
//     database: "readfun"
// });
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Lhh37440123.",
    database: "readfun",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
  
// Kết nối tới MySQL
// db.connect((err) => {
//     if (err) {
//         console.error("Kết nối thất bại!", err);
//         return;
//     }
//     console.log("Connected!!!");
// });

// module đại diện cho file hiện tại và exports để đưa các giá trị hoặc function chia sẻ ra ngoài file
module.exports = pool;

