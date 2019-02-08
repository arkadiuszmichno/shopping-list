const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

let user = require('../models/user');


router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(password);

    let errors = req.validationErrors();

    if (errors) {
        res.render('register', {
            errors: errors
        });
    } else {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                    console.log(err);
                }
                let hashPassword = hash;
                user.create(name, email, username, hashPassword, function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        req.flash('success', 'You are now registered and can log in');
                        res.redirect('/users/login');
                    }
                })
            })
        })
    }
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', (req, res, next) => {
    console.log('Req: ' + req);
    console.log('Req body: ' + req.body);
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

router.get('/logout', (req,res) => {
   req.logout();
   req.flash('success', 'You are logged out');
   res.redirect('/users/login');
});
module.exports = router;