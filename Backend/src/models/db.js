const { DataTypes } = require("sequelize");
const { db } = require("../db/connection");

const User = db.define("User", {
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  otp_enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  otp_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  otp_ascii: {
    type: DataTypes.STRING,
  },
  otp_hex: {
    type: DataTypes.STRING,
  },
  otp_base32: {
    type: DataTypes.STRING,
  },
  otp_auth_url: {
    type: DataTypes.STRING,
  },
  require2FA: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  timeZone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Schedule = db.define("Schedule", {
  day: {
    type: DataTypes.ENUM("D", "L", "K", "M", "J", "V", "S"),
    allowNull: false,
  },
  time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  state: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

const Channel = db.define("Channel", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  state: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

const Channels_Users = db.define("Channels_Users", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  state: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  mediaId: {
    type: DataTypes.STRING,
  },
  accessToken: {
    type: DataTypes.TEXT,
  },
  tokenSecret: {
    type: DataTypes.TEXT,
  },
  username: {
    type: DataTypes.STRING,
  },
  photoURL: {
    type: DataTypes.TEXT,
  },
});

const Post_Type = db.define("Post_Type", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  state: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

const Post = db.define("Post", {
  post: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  state: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

const Scheduled_Post = db.define("Scheduled_Post", {
  scheduledAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

const Posts_Channels = db.define("Posts_Channels", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
});

(async () => {
  //await User.sync();
  await User.sync({ alter: true });

  //User.hasMany(Schedule);
  Schedule.belongsTo(User, {
    foreignKey: "user_id",
  });
  await Schedule.sync();

  await Channel.sync();

  User.belongsToMany(Channel, { through: Channels_Users });
  Channel.belongsToMany(User, { through: Channels_Users });

  await Channels_Users.sync();

  await Post_Type.sync();

  Post.belongsTo(User, {
    foreignKey: "user_id",
  });
  Post.belongsTo(Post_Type, {
    foreignKey: "post_type_id",
  });
  await Post.sync();

  Post.hasOne(Scheduled_Post, {
    foreignKey: "post_id",
  });
  Scheduled_Post.belongsTo(Post, {
    foreignKey: "post_id",
  });
  await Scheduled_Post.sync();

  Channel.belongsToMany(Post, { through: Posts_Channels });
  Post.belongsToMany(Channel, { through: Posts_Channels });

  await Posts_Channels.sync();
})();

module.exports = {
  User,
  Schedule,
  Channel,
  Channels_Users,
  Post,
  Post_Type,
  Scheduled_Post,
  Posts_Channels,
};
