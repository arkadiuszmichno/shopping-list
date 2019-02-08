const express = require('express');

const {body, validationResult} = require('express-validator/check');
const lists = require('../models/list');
const router = express.Router();

router.post('/',
    [
        body('name')
            .isLength({min: 1})
            .withMessage('Please enter a name'),
    ],
    ensureAuthenticated,
    (req, res) => {
        const errors = validationResult(req);

        if (errors.isEmpty()) {
            lists.create(req.body.name, req.user.user_id, function (err) {
                if (err) {
                    console.log("Error while sending list to db occurred" + err);
                } else {
                    console.log("Successfully saved list to db");
                    res.redirect('/lists')
                }
            });
        } else {
            res.render('lists', {
                errors: errors.array(),
                data: req.body,
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