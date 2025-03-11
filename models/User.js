const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    kakaoId: { type: String, unique: true },
    admissionYear: { type: String},
    age: { type: String },
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
const User = mongoose.model("User", UserSchema);
module.exports = User;
