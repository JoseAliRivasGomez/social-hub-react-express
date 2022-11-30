const { response } = require("express");
const bcrypt = require("bcryptjs");
const { generarJWT } = require("../helpers/generar-jwt");
const { User, Channel } = require("../models/db");
const { Op } = require("sequelize");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const generator = require("generate-password");
const speakeasy = require("speakeasy");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  })
);

const signup = async (req, res = response, next) => {
  //add a user

  const { email, password } = req.body;

  try {
    const existeEmail = await User.findOne({
      where: {
        email,
      },
    });

    if (existeEmail) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    const usuario = User.build(req.body);

    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    await usuario.save();

    const token = await generarJWT(usuario.id);

    return res
      .cookie("token", token, {
        maxAge: 30 * 24 * 60 * 60 * 1000, //30d
        //sameSite: "none", //forces https
        httpOnly: process.env.NODE_ENV === "dev",
        secure: process.env.NODE_ENV === "prod",
      })
      .status(200)
      .json({
        //token,
        uid: usuario.id,
        first_name: usuario.first_name,
        last_name: usuario.last_name,
        email: usuario.email,
        state: usuario.state,
        otp_enabled: usuario.otp_enabled,
        require2FA: usuario.require2FA,
        timeZone: usuario.timeZone,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Please talk to the admin",
    });
  }
};

const login = async (req, res = response, next) => {
  //login

  const { email, password } = req.body;

  try {
    let usuario = await User.findOne({
      where: {
        email,
      },
      include: {
        model: Channel,
        where: {
          state: true,
        },
        through: {
          where: {
            state: true,
          },
        },
      },
    });

    if (!usuario) {
      usuario = await User.findOne({
        where: {
          email,
        },
      });
    }

    //console.log(usuario);

    if (!usuario) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const validPassword = bcrypt.compareSync(password, usuario.password);

    if (!validPassword) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = await generarJWT(usuario.id);

    if (usuario.otp_enabled) {
      await usuario.update({
        require2FA: true,
      });
    }

    return res
      .cookie("token", token, {
        maxAge: 30 * 24 * 60 * 60 * 1000, //30d
        //sameSite: "none", //forces https
        httpOnly: process.env.NODE_ENV === "dev",
        secure: process.env.NODE_ENV === "prod",
      })
      .status(200)
      .json({
        //token,
        uid: usuario.id,
        first_name: usuario.first_name,
        last_name: usuario.last_name,
        email: usuario.email,
        state: usuario.state,
        otp_enabled: usuario.otp_enabled,
        require2FA: usuario.require2FA,
        timeZone: usuario.timeZone,
        channels: usuario.Channels,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Please talk to the admin",
    });
  }
};

const forgotPassword = async (req, res = response, next) => {
  //forgot password

  const { email } = req.body;

  try {
    const usuario = await User.findOne({
      where: {
        email,
        state: true,
      },
    });

    if (!usuario) {
      return res.status(404).json({
        message: "Invalid email",
      });
    }

    const newPassword = generator.generate({
      length: 16,
      numbers: true,
    });

    const salt = bcrypt.genSaltSync();
    const newPass = bcrypt.hashSync(newPassword, salt);

    await usuario.update({ password: newPass });

    transporter
      .sendMail({
        to: email,
        from: "jrivasg@est.utn.ac.cr", //Registered mail
        subject: "Here is your new password for Social Hub Manager",
        html: `<h1>You can now login to your account with this password: ${newPassword}</h1>`,
      })
      .then((response) => {
        //console.log("response:", response);

        res.status(200).json({
          message: "New password sent to email",
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({
          message: "Error while sending new password",
        });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Please talk to the admin",
    });
  }
};

const revalidateToken = async (req, res = response) => {
  const { userJWT } = req;
  console.log(userJWT);

  let usuario = await User.findOne({
    where: {
      email: userJWT.email,
    },
    include: {
      model: Channel,
      where: {
        state: true,
      },
      through: {
        where: {
          state: true,
        },
      },
    },
  });

  if (!usuario) {
    usuario = await User.findOne({
      where: {
        email: userJWT.email,
      },
    });
  }

  //console.log(usuario);
  const token = await generarJWT(usuario.id);

  return res
    .cookie("token", token, {
      maxAge: 30 * 24 * 60 * 60 * 1000, //30d
      //sameSite: "none", //forces https
      httpOnly: process.env.NODE_ENV === "dev",
      secure: process.env.NODE_ENV === "prod",
    })
    .status(200)
    .json({
      //token,
      uid: usuario.id,
      first_name: usuario.first_name,
      last_name: usuario.last_name,
      email: usuario.email,
      state: usuario.state,
      otp_enabled: usuario.otp_enabled,
      require2FA: usuario.require2FA,
      timeZone: usuario.timeZone,
      channels: usuario.Channels,
    });
};

const getUser = async (req, res = response) => {
  const { userJWT } = req;

  let usuario = await User.findOne({
    where: {
      email: userJWT.email,
    },
    include: {
      model: Channel,
      where: {
        state: true,
      },
      through: {
        where: {
          state: true,
        },
      },
    },
  });

  if (!usuario) {
    usuario = await User.findOne({
      where: {
        email: userJWT.email,
      },
    });
  }

  return res.status(200).json({
    uid: usuario.id,
    first_name: usuario.first_name,
    last_name: usuario.last_name,
    email: usuario.email,
    state: usuario.state,
    otp_enabled: usuario.otp_enabled,
    require2FA: usuario.require2FA,
    timeZone: usuario.timeZone,
    channels: usuario.Channels,
  });
};

const logout = async (req, res = response, next) => {
  return res
    .clearCookie("token")
    .status(200)
    .json({ message: "Successfully logged out" });
};

const checkPassword = async (req, res = response, next) => {
  //Check password by id

  const idParam = req.params.id;

  const { oldPassword } = req.body;

  try {
    const usuario = await User.findOne({
      where: {
        id: idParam,
        state: true,
      },
    });

    if (!usuario) {
      return res.status(404).json({
        message: "Invalid user ID",
      });
    }

    const validPassword = bcrypt.compareSync(oldPassword, usuario.password);

    if (!validPassword) {
      return res.status(400).json({
        message: "Old password is invalid",
      });
    }

    res.json({
      uid: usuario.id,
      first_name: usuario.first_name,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Please talk to the admin",
    });
  }
};

const updateUser = async (req, res = response, next) => {
  //update a user by id

  const idParam = req.params.id;
  const { body } = req;
  const { password, ...rest } = body;

  try {
    const usuario = await User.findOne({
      where: {
        id: idParam,
        state: true,
      },
    });

    if (!usuario) {
      return res.status(404).json({
        message: "Invalid user ID",
      });
    }

    const existeEmail = await User.findOne({
      where: {
        email: body.email,
        state: true,
        id: {
          [Op.ne]: idParam,
        },
      },
    });

    if (existeEmail) {
      return res.status(400).json({
        msg: `Email already exists`,
      });
    }

    await usuario.update(rest); //dont update password

    res.status(200).json({
      user: usuario,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Please talk to the admin",
    });
  }
};

const updatePassword = async (req, res = response, next) => {
  //update a user password by id

  const idParam = req.params.id;

  const { body } = req;

  try {
    const usuario = await User.findOne({
      where: {
        id: idParam,
        state: true,
      },
    });

    if (!usuario) {
      return res.status(404).json({
        message: "Invalid user ID",
      });
    }

    const pass = req.body.newPassword;

    const salt = bcrypt.genSaltSync();
    const password = bcrypt.hashSync(pass, salt);

    await usuario.update({ password: password }); //update password

    res.status(200).json({
      user: usuario,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Please talk to the admin",
    });
  }
};

const generateOTP = async (req, res = response, next) => {
  const { userJWT } = req;

  try {
    const { ascii, hex, base32, otpauth_url } = speakeasy.generateSecret({
      issuer: "socialhubmanager.com",
      name: "Social Hub Manager",
      length: 15,
    });

    await userJWT.update({
      otp_ascii: ascii,
      otp_auth_url: otpauth_url,
      otp_base32: base32,
      otp_hex: hex,
    });

    res.status(200).json({
      base32,
      otpauth_url,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Please talk to the admin",
    });
  }
};

const verifyOTP = async (req, res = response, next) => {
  const { userJWT } = req;
  const { otp_token } = req.body;

  try {
    const verified = speakeasy.totp.verify({
      secret: userJWT.otp_base32,
      encoding: "base32",
      token: otp_token,
    });

    if (!verified) {
      return res.status(401).json({
        message: "Invalid Authentication Code",
      });
    }

    await userJWT.update({
      otp_enabled: true,
      otp_verified: true,
    });

    res.status(200).json({
      otp_verified: true,
      user: {
        id: userJWT.id,
        first_name: userJWT.first_name,
        last_name: userJWT.last_name,
        email: userJWT.email,
        otp_enabled: userJWT.otp_enabled,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Please talk to the admin",
    });
  }
};

const validateOTP = async (req, res = response, next) => {
  const { userJWT } = req;
  const { otp_token } = req.body;

  try {
    const validToken = speakeasy.totp.verify({
      secret: userJWT.otp_base32,
      encoding: "base32",
      token: otp_token,
      window: 1,
    });

    if (!validToken) {
      return res.status(401).json({
        message: "Invalid Authentication Code",
      });
    }

    await userJWT.update({
      require2FA: false,
    });

    // res.status(200).json({
    //     otp_valid: true,
    // });

    return res.status(200).json({
      uid: userJWT.id,
      first_name: userJWT.first_name,
      last_name: userJWT.last_name,
      email: userJWT.email,
      state: userJWT.state,
      otp_enabled: userJWT.otp_enabled,
      require2FA: userJWT.require2FA,
      timeZone: userJWT.timeZone,
      channels: userJWT.Channels,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Please talk to the admin",
    });
  }
};

const disableOTP = async (req, res = response, next) => {
  const { userJWT } = req;

  try {
    await userJWT.update({
      otp_enabled: false,
      otp_verified: false, //they didnt disable this in the tutorial
    });

    res.status(200).json({
      otp_disabled: true,
      user: {
        id: userJWT.id,
        first_name: userJWT.first_name,
        last_name: userJWT.last_name,
        email: userJWT.email,
        otp_enabled: userJWT.otp_enabled,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Please talk to the admin",
    });
  }
};

exports.signup = signup;
exports.login = login;
exports.revalidateToken = revalidateToken;
exports.logout = logout;
exports.getUser = getUser;
exports.forgotPassword = forgotPassword;
exports.checkPassword = checkPassword;
exports.updateUser = updateUser;
exports.updatePassword = updatePassword;
exports.generateOTP = generateOTP;
exports.verifyOTP = verifyOTP;
exports.validateOTP = validateOTP;
exports.disableOTP = disableOTP;
