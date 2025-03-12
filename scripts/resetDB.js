const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User"); // User 모델 불러오기

dotenv.config(); // 환경 변수 로드

// MongoDB 연결
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const resetDatabase = async () => {
  try {
    console.log("🛑 기존 users 컬렉션 삭제 중...");
    await User.deleteMany({}); // 모든 데이터 삭제

    console.log("✅ 데이터 초기화 완료!");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ 데이터 초기화 오류:", error);
    mongoose.connection.close();
  }
};

// 실행
resetDatabase();
