import bcrypt from 'bcrypt';
import { createUser } from '../models/users.js';
import { authenticateUser } from '../models/users.js';
import { getAllUsers } from '../models/users.js';
import { getVolunteeredProjectsByUserId } from '../models/volunteers.js';

// Create the Register controller with functions to show the registration form and process the form submission
const showUserRegistrationForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Hash the password before storing it
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create the user in the database
        const userId = await createUser(name, email, passwordHash);

        // Redirect to the home page after successful registration
        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/');
    } catch (error) {
        console.error('Error registering user:', error);
        req.flash('error', 'An error occurred during registration. Please try again.');
        res.redirect('/register');
    }
};

// Create the Login controller with functions to show the login form and process the form submission
const showLoginForm = (req, res) => {
    res.render('login', { title: 'Login' }); //renders the login view
};

const processLoginForm = async (req, res) => {
    const { email, password } = req.body; // Get email and password from the request body

    try {
        const user = await authenticateUser(email, password);
        if (user) {
            // Store user info in session
            req.session.user = user;
            req.flash('success', 'Login successful!');

            if (res.locals.NODE_ENV === 'development') {
                console.log('User logged in:', user);
            }

            res.redirect('/dashboard'); //redirect to the dashboard after successful login
        } else {
            req.flash('error', 'Invalid email or password.');
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error during login:', error);
        req.flash('error', 'An error occurred during login. Please try again.');
        res.redirect('/login');
    }
};

const processLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect('/login');
    });
};

const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }
    next();
};

const showDashboard = async(req, res) => {
    const user = req.session.user;
    const volunteeredProjects = await getVolunteeredProjectsByUserId(user.user_id);
    
    res.render('dashboard', {
        title: 'Dashboard',
        name: user.name,
        email: user.email, 
        volunteeredProjects
    });
};

/**
 * Middleware factory to require specific role for route access
 * Returns middleware that checks if user has the required role
 * 
 * @param {string} role - The role name required (e.g., 'admin', 'user')
 * @returns {Function} Express middleware function
 */
const requireRole = (role) => {
    return (req, res, next) => {
        // Check if user is logged in first
        if (!req.session || !req.session.user) {
            req.flash('error', 'You must be logged in to access this page.');
            return res.redirect('/login');
        }

        // Check if user's role matches the required role
        if (req.session.user.role_name !== role) {
            req.flash('error', 'You do not have permission to access this page.');
            return res.redirect('/'); 
        }

        // User has required role, continue
        next();
    };
};

const showUsersPage = async (req, res) => {
    const users = await getAllUsers();
    res.render('users', { title: 'Registered Users', users });
};

export { showUserRegistrationForm, processUserRegistrationForm, showLoginForm, processLoginForm, processLogout, requireLogin, showDashboard, requireRole, showUsersPage };