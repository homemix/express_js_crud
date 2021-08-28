var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');

// display patients page
router.get('/', function(req, res, next) {

    dbConn.query('SELECT * FROM patients ORDER BY id desc',function(err,rows)     {

        if(err) {
            req.flash('error', err);
            // render to views/patients/index.ejs
            res.render('patients',{data:''});
        } else {
            // render to views/patients/index.ejs
            res.render('patients',{data:rows});
        }
    });
});

// display add patient page
router.get('/add', function(req, res, next) {
    // render to add.ejs
    res.render('patients/add', {
        name: '',
        gender: '',
        phone: '',
        date_visited: ''
    })
})

// add a new patient
router.post('/add', function(req, res, next) {

    let name = req.body.name;
    let gender = req.body.gender;
    let phone = req.body.phone;
    let date_visited = req.body.date_visited;
    let errors = false;

    if(name.length === 0 || gender.length === 0 || phone.length === 0 || date_visited.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter all the fields");
        // render to add.ejs with flash message
        res.render('patients/add', {
            name: '',
            gender: '',
            phone: '',
            date_visited: ''
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            name: name,
            gender: gender,
            phone:phone,
            date_visited:date_visited
        }

        // insert query
        dbConn.query('INSERT INTO patients SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)

                // render to add.ejs
                res.render('patients/add', {
                    name: form_data.name,
                    gender: form_data.gender,
                    phone: form_data.phone,
                    date_visited: form_data.date_visited,
                })
            } else {
                req.flash('success', 'patient successfully added');
                res.redirect('/patients');
            }
        })
    }
})

// display edit patient page
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;

    dbConn.query('SELECT * FROM patients WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err

        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'patient not found with id = ' + id)
            res.redirect('/patients')
        }
        // if patient found
        else {
            // render to edit.ejs
            res.render('patients/edit', {
                title: 'Edit patient',
                id: rows[0].id,
                name: rows[0].name,
                gender: rows[0].gender,
                phone: rows[0].phone,
                date_visited: rows[0].date_visited,
            })
        }
    })
})

// update patient data
router.post('/update/:id', function(req, res, next) {

    let id = req.params.id;
    let name = req.body.name;
    let gender = req.body.gender;
    let phone = req.body.phone;
    let date_visited = req.body.date_visited;
    let errors = false;

    if(name.length === 0 || gender.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter all fields");
        // render to add.ejs with flash message
        res.render('patients/edit', {
            id: req.params.id,
            name: name,
            gender: gender,
            phone:phone,
            date_visited:date_visited
        })
    }

    // if no error
    if( !errors ) {

        var form_data = {
            name: name,
            gender: gender,
            phone:phone,
            date_visited:date_visited
        }
        // update query
        dbConn.query('UPDATE patients SET ? WHERE id = ' + id, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('patients/edit', {
                    id: req.params.id,
                    name: form_data.name,
                    gender: form_data.gender,
                    phone: form_data.phone,
                    date_visited: form_data.date_visited,
                })
            } else {
                req.flash('success', 'patient successfully updated');
                res.redirect('/patients');
            }
        })
    }
})

// delete patient
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;

    dbConn.query('DELETE FROM patients WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to patients page
            res.redirect('/patients')
        } else {
            // set flash message
            req.flash('success', 'patient successfully deleted! ID = ' + id)
            // redirect to patients page
            res.redirect('/patients')
        }
    })
})

module.exports = router;