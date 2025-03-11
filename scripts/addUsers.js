const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User"); // User 모델 불러오기

dotenv.config(); // 환경 변수 로드

// MongoDB 연결
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedUsers = async () => {
  try {
    await User.insertMany([
      {
        kakaoId: "3954203015",
        admissionYear: "21",
        age: "22",
        hobby: ["reading"],
        isFirstLogin: false,
        isFirstMatch: true,
        matchedUsers: [],
        comment: "첫 번째 사용자",
        contactFrequency: "보통",
        contact_id: "@firstuser",
        major: "국어국문학과",
        mbti: "ESFJ",
        song: "Song 1",
      },
      {
        kakaoId: "123456789",
        admissionYear: "21",
        age: "23",
        hobby: ["gaming"],
        isFirstLogin: false,
        isFirstMatch: true,
        matchedUsers: [],
        comment: "두 번째 사용자",
        contactFrequency: "자주",
        contact_id: "@seconduser",
        major: "컴퓨터공학과",
        mbti: "INTP",
        song: "Song 2",
      },
      {
        kakaoId: "987654321",
        admissionYear: "20",
        age: "22",
        hobby: ["sports"],
        isFirstLogin: false,
        isFirstMatch: true,
        matchedUsers: [],
        comment: "세 번째 사용자",
        contactFrequency: "가끔",
        contact_id: "@thirduser",
        major: "경영학과",
        mbti: "ISTJ",
        song: "Song 3",
      },
      {
        kakaoId: "567890123",
        admissionYear: "22",
        age: "24",
        hobby: ["music"],
        isFirstLogin: false,
        isFirstMatch: true,
        matchedUsers: [],
        comment: "네 번째 사용자",
        contactFrequency: "자주",
        contact_id: "@fourthuser",
        major: "경제학과",
        mbti: "INFJ",
        song: "Song 4",
      },
      {
        kakaoId: "112233445",
        admissionYear: "21",
        age: "22",
        hobby: ["cooking"],
        isFirstLogin: false,
        isFirstMatch: true,
        matchedUsers: [],
        comment: "다섯 번째 사용자",
        contactFrequency: "보통",
        contact_id: "@fifthuser",
        major: "물리학과",
        mbti: "ENFP",
        song: "Song 5",
      },
      {
        kakaoId: "998877665",
        admissionYear: "20",
        age: "21",
        hobby: ["hiking"],
        isFirstLogin: false,
        isFirstMatch: true,
        matchedUsers: [],
        comment: "여섯 번째 사용자",
        contactFrequency: "가끔",
        contact_id: "@sixthuser",
        major: "수학과",
        mbti: "ENTP",
        song: "Song 6",
      },
      {
        kakaoId: "443322110",
        admissionYear: "19",
        age: "25",
        hobby: ["traveling"],
        isFirstLogin: false,
        isFirstMatch: true,
        matchedUsers: [],
        comment: "일곱 번째 사용자",
        contactFrequency: "자주",
        contact_id: "@seventhuser",
        major: "사회학과",
        mbti: "ISFP",
        song: "Song 7",
      },
      {
        kakaoId: "776655443",
        admissionYear: "21",
        age: "22",
        hobby: ["swimming"],
        isFirstLogin: false,
        isFirstMatch: true,
        matchedUsers: [],
        comment: "여덟 번째 사용자",
        contactFrequency: "보통",
        contact_id: "@eighthuser",
        major: "화학과",
        mbti: "ESTJ",
        song: "Song 8",
      },
      {
        kakaoId: "334455667",
        admissionYear: "22",
        age: "23",
        hobby: ["watching movies"],
        isFirstLogin: false,
        isFirstMatch: true,
        matchedUsers: [],
        comment: "아홉 번째 사용자",
        contactFrequency: "자주",
        contact_id: "@ninthuser",
        major: "전기공학과",
        mbti: "INTJ",
        song: "Song 9",
      },
      {
        kakaoId: "665544332",
        admissionYear: "20",
        age: "21",
        hobby: ["drawing"],
        isFirstLogin: false,
        isFirstMatch: true,
        matchedUsers: [],
        comment: "열 번째 사용자",
        contactFrequency: "가끔",
        contact_id: "@tenthuser",
        major: "건축학과",
        mbti: "ISTP",
        song: "Song 10",
      },
    ]);

    console.log("✅ 테스트 사용자 10명 추가 완료!");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ 데이터 삽입 오류:", error);
    mongoose.connection.close();
  }
};

// 실행
seedUsers();
