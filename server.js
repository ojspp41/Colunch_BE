require("dotenv").config();//env
const express = require("express");
const connectDB = require("./config/db"); // MongoDB 연결
const passport = require("./config/passport"); // ✅ 추가
const session = require("express-session");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

// ✅ MongoDB 연결 실행
connectDB();

// ✅ 미들웨어 설정
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// ✅ 라우트 설정
app.use("/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/user"));
app.use("/api/participations", require("./routes/participations")); // ✅ 추가된 라우트

app.use("/api/matching", require("./routes/matching")); // ✅ 매칭 라우트 추가
// ✅ 서버 실행
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
