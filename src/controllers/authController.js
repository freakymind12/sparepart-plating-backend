const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

const handleResponse = (res, message, status = 200) => {
  res.status(status).json({ message });
};

const handleError = (res, error) => {
  console.error('Error:', error);
  res.status(500).json({ message: 'Server Error' });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Temukan pengguna berdasarkan nama pengguna
    const user = await userModel.findUserByEmail(email);
    if (!user[0]) {
      return handleResponse(res, 'This email is not registered', 401)
    }

    // Verifikasi kata sandi
    const passwordMatch = await bcrypt.compare(password, user[0].password);
    if (!passwordMatch) {
      return handleResponse(res, 'Wrong password', 401)
    }

    // Variabel waktu expired token dalam format jam
    // const expiresIn = 86400
    // Buat token JWT
    const token = jwt.sign({ id_user: user[0].id_user, role: user[0].roles, username: user[0].username }, process.env.JWT_SECRET, { expiresIn: '12h' });
    const role = user[0].role

    // coba taruh di cookie http respons
    // res.cookie('jwt_token', token, {
    //   httpOnly: true,
    //   sameSite: 'Lax',
    //   secure: false,
    //   maxAge: 3600000 
    // });

    // console.log('Token sent in cookie' ,token)
    // res.status(200).send({ message: 'User login successfully' });

    res.json({ token, role });
  } catch (error) {
    handleError(res, error);
  }
}

const validateToken = async (req, res) => {
    // Mendapatkan token dari header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    // Jika token tidak ada, kembalikan respon error
    if (!token) {
      return handleResponse(res, 'Token not found', 401)
    }

    try {
        // Verifikasi token dengan menggunakan secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Jika pengguna tidak memiliki peran admin, kembalikan respon error
        return res.status(200).json({ session: 'active', role: decoded.role, name: decoded.username, id: decoded.id_user });
    } catch (error) {
        // Jika terjadi kesalahan dalam verifikasi, tangani kondisi ketika token telah kedaluwarsa
        console.log(error.name)
        if (error.name === 'TokenExpiredError') {
          return res.status(200).json({ session: 'expired', role: null });
        } else {
          return res.status(401).json({ message: 'Unauthorized' });
        }
    }
}

const logoutUser = (req, res) => {
  // Di sini Anda dapat menghapus token dari sisi klien
  // Misalnya, jika menggunakan aplikasi web, Anda dapat menghapus token dari local storage atau session storage
  // Jika menggunakan aplikasi mobile, Anda dapat menghapus token dari penyimpanan aman yang digunakan
  // Di sini, untuk tujuan contoh, kita anggap token dihapus dari header Authorization

  handleResponse(res, 'Logout Success')
}

module.exports = {
  loginUser,
  logoutUser,
  validateToken
}