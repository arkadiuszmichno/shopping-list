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

    req.checkBody('name', 'Imie jest wymagane').notEmpty();
    req.checkBody('email', 'Email jest wymagany').notEmpty();
    req.checkBody('email', 'Email jest niepoprawny').isEmail();
    req.checkBody('username', 'Nazwa użytkownika jest wymagana').notEmpty();
    req.checkBody('password', 'Hasło jest wymagane').notEmpty();
    req.checkBody('password2', 'Hasła nie pasują do siebie').equals(password);

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
                        req.flash('error', 'Użytkownik już istnieje');
                        res.redirect('/users/register')
                    } else {
                        req.flash('success', 'Możesz się teraz zalogować');
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
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Jesteś wylogowany');
    res.redirect('/users/login');
});
module.exports = router;