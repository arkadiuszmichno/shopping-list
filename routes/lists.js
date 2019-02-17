const express = require('express');

const lists = require('../models/list');
const router = express.Router();

router.post('/',
    ensureAuthenticated,
    (req, res) => {
        req.checkBody('name', 'Nazwa jest wymagana').notEmpty();

        let errors = req.validationErrors();

        if (errors) {
            errors.forEach(error => {
                req.flash('error', error.msg);
            });
            res.redirect('/lists/')
        } else {
            lists.create(req.body.name, req.user.user_id, function (err) {
                if (err) {
                    console.log("Error while sending list to db occurred" + err);
                } else {
                    console.log("Successfully saved list to db");
                    res.redirect('/lists')
                }
            });
        }
    });

router.get('/', ensureAuthenticated, (req, res) => {
    lists.getAll(req.user.user_id, function (err, rows) {
        if (err) {
            res.send("Something went wrong.")
        } else {
            res.render('lists', {rows});
        }
    })
});
router.get('/:listId', ensureAuthenticated, (req, res) => {
    let listId = req.params.listId;
    lists.getList(listId, req.user.user_id, function (err, list) {
        if (err) {
            res.send("Something gone wrong.")
        } else {
            res.render('list', {list});
        }
    })
});

router.post('/:listId/delete', ensureAuthenticated, (req, res) => {
    let listId = req.params.listId;
    lists.deleteList(listId, function (err) {
        if (err) {
            console.log('Error while deleting list: ' + err);
            res.send("Something gone wrong");
        } else {
            res.redirect('/lists');
        }
    })
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('danger', 'Please login');
        res.redirect('/users/login');
    }
}

module.exports = router;