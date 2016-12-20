var db = require('../../config/db');
var findOneOrCreate = require('mongoose-find-one-or-create');

// Schema/models:
var UserProfileSchema = new db.Schema({
  userName: String,
  grid: Object,
  highScores: Array,
  currentScore: Object,
  health: Number,
  userId: String,
  currentWorld: String
});

UserProfileSchema.plugin(findOneOrCreate);

var UserProfile = db.model('UserProfile', UserProfileSchema);

module.exports = UserProfile;
