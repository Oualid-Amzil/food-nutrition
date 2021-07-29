const { promisify } = require("util");
const User = require("./../models/userModel");
const catshAsync = require("./../util/catshAsync");
const AppError = require("./../util/appError");
const JWT = require("jsonwebtoken");
const sendEmail = require("./../util/email");
const crypto = require("crypto");

const signToken = (id) => {
  return JWT.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 100
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "development") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user: user,
    },
  });
};

exports.signUp = catshAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createSendToken(user, 200, res);
});

exports.logIn = catshAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide an email and password.", 400));
  }

  const user = await User.findOne({ email: email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppErro("Incorrect email or password.", 400));
  }

  const token = signToken(user.id);
  res.status(200).json({
    status: "success",
    token,
  });
});

exports.protect = catshAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("Your not loged in! Please log in again.", 401));
  }

  const decoded = await promisify(JWT.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token is no longer exist.", 401)
    );
  }

  if (currentUser.passwordChangedAfter(decoded.iat)) {
    return next(new AppError("User has changed his password recently.", 401));
  }

  req.user = currentUser;

  next();
});

exports.restrict = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action.", 401)
      );
    }
  };
};

exports.forgotPassword = catshAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError("There is no user with that email address.", 400));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBefore: false });

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/useres/resetPassword/${resetToken}`;

  message = `You forgot password? Submit a PATCH request with new password and password confirm to : ${resetURL}.\nIf you didn't forget your password please ignore this message.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token is (valid for 10min)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "The token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBefore: false });

    return next(new AppError("There is an error in sending email.", 500));
  }
});

exports.resetPassword = catshAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Token is invalid or has expired.", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createSendToken(user, 200, res);
});

exports.updatePassword = catshAsync(async (req, res, next) => {
  const currentUser = await User.findById(req.user.id).select("+password");

  if (
    !(await currentUser.correctPassword(
      req.body.passwordCurrent,
      currentUser.password
    ))
  ) {
    return next(new AppError("Incorrect Password.", 401));
  }

  currentUser.password = req.body.password;
  currentUser.passwordConfirm = req.body.passwordConfirm;
  await currentUser.save();

  res.status(200).json({
    status: "success",
    data: {
      user: currentUser,
    },
  });
});
