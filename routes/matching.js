const express = require("express");
const router = express.Router();
const User = require("../models/User"); // User 모델
const { verifyToken } = require("../config/jwt"); // ✅ JWT 검증 미들웨어 사용

// ✅ 매칭 요청 엔드포인트
router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id; // 사용자 ID

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const matchedUserIds = user.matchedUsers.map(id => id.toString());

    let potentialMatches = [];

    // ✅ 1. 학번 같은 사람 중 매칭된 사람 제외하고 찾기
    potentialMatches = await User.find({
      _id: { $ne: userId, $nin: matchedUserIds },
      admissionYear: user.admissionYear
    });

    // ✅ 2. 학번 같은 사람이 없다면 전체에서 매칭된 사람 제외하고 찾기
    if (potentialMatches.length === 0) {
      potentialMatches = await User.find({
        _id: { $ne: userId, $nin: matchedUserIds }
      });
    }

    // 매칭할 사람이 없으면
    if (potentialMatches.length === 0) {
      return res.status(404).json({ message: "No matching user found" });
    }

    // ✅ 3. 랜덤으로 한 명 선택
    const randomIndex = Math.floor(Math.random() * potentialMatches.length);
    const match = potentialMatches[randomIndex];

    // matchedUsers에 추가
    user.matchedUsers.push(match._id);

    // 첫 매칭 여부 처리
    if (user.isFirstMatch) {
      user.isFirstMatch = false;
    }

    await user.save();

    res.json({
      message: "Matching successful",
      matchedUser: {
        _id: match._id,
        admissionYear: match.admissionYear,
        age: match.age,
        comment: match.comment,
        contactFrequency: match.contactFrequency,
        contact_id: match.contact_id,
        hobby: match.hobby,
        major: match.major,
        mbti: match.mbti,
        song: match.song,
      },
    });

  } catch (error) {
    console.error("Matching Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


    // 응답
    res.json({
      message: "Matching successful",
      matchedUser: {
        _id: match._id,
        admissionYear: match.admissionYear,
        age: match.age,
        comment: match.comment,
        contactFrequency: match.contactFrequency,
        contact_id: match.contact_id,
        hobby: match.hobby,
        major: match.major,
        mbti: match.mbti,
        song: match.song,
      },
    });
  } catch (error) {
    console.error("Matching Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ 매칭된 유저 정보 반환 API
router.get("/matched-users", verifyToken, async (req, res) => {
  try {
    // 현재 요청한 사용자의 ID 가져오기
    const userId = req.user.id;

    // 유저 정보 가져오기 (matchedUsers ID 포함)
    const user = await User.findById(userId).populate(
      "matchedUsers",
      " admissionYear age major mbti comment contactFrequency contact_id hobby song gender "
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 매칭된 유저들의 정보 반환
    res.json({ matchedUsers: user.matchedUsers });
  } catch (error) {
    console.error("Error fetching matched users:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
