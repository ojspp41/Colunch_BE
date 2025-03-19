const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User"); // User 모델 불러오기

dotenv.config(); // 환경 변수 로드

// MongoDB 연결
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const removeUsersWithoutAdmissionYear = async () => {
  try {
    console.log("🛑 학번이 없는 사용자 삭제 중...");

    // admissionYear 필드가 없거나, null인 경우 삭제
    const result = await User.deleteMany({
      $or: [
        { admissionYear: { $exists: false } },
        { admissionYear: null }
      ]
    });

    console.log(`✅ ${result.deletedCount}명의 사용자 삭제 완료!`);
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ 사용자 삭제 오류:", error);
    mongoose.connection.close();
  }
};

// 실행
removeUsersWithoutAdmissionYear();
