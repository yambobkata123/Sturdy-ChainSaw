import User from '../models/User.js';
import bcrypt from 'bcrypt';

export async function register(req, res) {
  const { firstName, lastName, email, password, repeatPassword } = req.body;
  const errors = [];

  // Validation
  if (!firstName || firstName.trim().length < 3) {
    errors.push('First name must be at least 3 characters.');
  }
  if (!lastName || lastName.trim().length < 3) {
    errors.push('Last name must be at least 3 characters.');
  }
  if (!email || email.trim().length < 10) {
    errors.push('Email must be at least 10 characters.');
  }
  if (!password || password.length < 4) {
    errors.push('Password must be at least 4 characters.');
  }
  if (!repeatPassword || password !== repeatPassword) {
    errors.push('Passwords do not match.');
  }

  if (errors.length > 0) {
    return res.status(400).render('register', {
      errors,
      firstName,
      lastName,
      email,
      title: 'Register'
    });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      errors.push('Email already registered.');
      return res.status(400).render('register', {
        errors,
        firstName,
        lastName,
        email,
        title: 'Register'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      password: hashedPassword
    });

    req.session.user = {
      _id: user._id,
      email: user.email
    };

    return res.redirect('/');
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).render('register', {
      errors: ['Registration failed. Please try again later.'],
      firstName,
      lastName,
      email,
      title: 'Register'
    });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;
  const errors = [];

  if (!email || email.trim().length < 10) {
    errors.push('Email must be at least 10 characters.');
  }
  if (!password || password.length < 4) {
    errors.push('Password must be at least 4 characters.');
  }

  if (errors.length > 0) {
    return res.status(400).render('login', {
      errors,
      email,
      title: 'Login'
    });
  }

  try {
    const user = await User.findOne({ email: email.trim() });
    if (!user) {
      return res.status(401).render('login', {
        errors: ['Invalid email or password.'],
        email,
        title: 'Login'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).render('login', {
        errors: ['Invalid email or password.'],
        email,
        title: 'Login'
      });
    }

    req.session.user = {
      _id: user._id,
      email: user.email
    };

    return res.redirect('/');
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).render('login', {
      errors: ['Login failed. Please try again later.'],
      email,
      title: 'Login'
    });
  }
}

export function logout(req, res) {
  req.session.destroy(err => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).send('Could not log out. Please try again.');
    }
    res.redirect('/auth/login');
  });
}
