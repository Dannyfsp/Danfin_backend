const validateUserRegistration = (req, res, next) => {
  try {
    const {
      firstname,
      lastname,
      email,
      password,
      balance,
      profileImage,
      gender,
    } = req.body;

    switch (true) {
      case !firstname || firstname.length < 2:
        return res.status(400).json({ message: 'first name is required' });
      case !lastname || lastname.length < 2:
        return res.status(400).json({ message: 'last name is required' });
      case !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email):
        return res
          .status(400)
          .json({ message: 'email is required and must be a valid email' });
      case !password || password.length < 8:
        return res.status(400).json({
          message: 'password is required and must be up to 8 characters',
        });
      case !balance || typeof balance !== 'string':
        return res
          .status(400)
          .json({ message: 'balance is required and must be a string' });
      case !profileImage:
        return res.status(400).json({ message: 'profile image is required' });
      case !gender || gender.length < 4:
        return res.status(400).json({ message: 'gender is required' });
      default:
        next();
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = validateUserRegistration;
