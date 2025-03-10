const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    kakaoId: { type: String, unique: true },
    admissionYear: { type: Number, required: true },
    age: { type: Number, required: true },
    comment: { type: String },
    contactFrequency: { type: String },
    contact_id: { type: String },
    hobby: { type: [String] },
    major: { type: String },
    mbti: { type: String },
    song: { type: String },
    isFirstLogin: { type: Boolean, default: true },
    isFirstMatch: { type: Boolean, default: true }, // ✅ 첫 매칭 가능 여부 추가
    matchedUsers: { type: [mongoose.Schema.Types.ObjectId], ref: "User", default: [] }, // 매칭된 유저 리스트
});
router.get("/match", verifyToken, async (req, res) => {
  try {
    console.log("Decoded User:", req.user);

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
    }

    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "유저를 찾을 수 없습니다." });
    }

    // 🔹 사용자가 이미 매칭을 시도한 적이 있는지 확인
    if (!user.isFirstMatch) {
      return res.status(403).json({ message: "매칭은 한 번만 가능합니다." });
    }

    // 🔹 사용자의 학번 (admissionYear)
    const { admissionYear } = user;

    // 🔹 이미 매칭된 유저 목록
    const matchedUsers = user.matchedUsers || [];

    // 🔹 같은 학번의 유저 중, 자기 자신과 이미 매칭된 유저를 제외하고 찾음
    const candidates = await User.find({
      admissionYear,
      _id: { $ne: userId }, // 자기 자신 제외
      matchedUsers: { $nin: [userId] }, // 이미 매칭된 사람 제외
    });

    if (candidates.length === 0) {
      return res.status(404).json({ message: "매칭 가능한 사용자가 없습니다." });
    }

    // 🔹 랜덤으로 한 명 선택
    const matchedUser = candidates[Math.floor(Math.random() * candidates.length)];

    // 🔹 매칭된 사람을 서로의 matchedUsers 목록에 추가
    user.matchedUsers = [...(user.matchedUsers || []), matchedUser._id];
    matchedUser.matchedUsers = [...(matchedUser.matchedUsers || []), userId];

    // 🔹 이제 더 이상 직접 매칭을 할 수 없도록 설정
    user.isFirstMatch = false;

    // 🔹 변경 사항을 저장
    await user.save();
    await matchedUser.save();

    // 🔹 매칭된 사용자 정보 응답 (보안상 필요한 정보만 전달)
    res.json({
      message: "매칭이 완료되었습니다. 한 번만 매칭할 수 있습니다!",
      matchedUser: {
        _id: matchedUser._id,
        contact_id: matchedUser.contact_id,
        username: matchedUser.username,
        age: matchedUser.age,
        hobby: matchedUser.hobby,
        major: matchedUser.major,
        mbti: matchedUser.mbti,
        song: matchedUser.song,
        comment: matchedUser.comment,
      },
    });
  } catch (error) {
    console.error("❌ 매칭 에러:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

module.exports = router;
✅ 3️⃣ 클라이언트에서 GET 요청 보내기
사용자가 직접 매칭 버튼을 눌렀을 때 요청을 보냅니다.

const handleMatch = async () => {
    try {
        const accessToken = document.cookie
            .split("; ")
            .find(row => row.startsWith("accessToken="))
            ?.split("=")[1]; 

        if (!accessToken) {
            throw new Error("Access token이 없습니다.");
        }

        const response = await fetch("http://localhost:8000/api/users/match", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            credentials: "include",
        });

        const data = await response.json();
        
        if (response.ok) {
            console.log("매칭 성공:", data);
            alert(`매칭된 사용자: ${data.matchedUser.username} (${data.matchedUser.contact_id})`);
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error("매칭 오류 발생:", error);
        alert("서버 오류가 발생했습니다.");
    }
};
const User = mongoose.model("User", UserSchema);
module.exports = User;
