'use strict'

var express = require('express');
var app = express.Router();
var database = require('../Database/database');
var winston = require('winston');
var env = process.env.NODE_ENV || 'development';

var tsFormat = () => (new Date()).toLocaleTimeString();
var logger = new(winston.Logger)({
    transports: [

        new(winston.transports.Console)({
            timestamp: tsFormat,
            colorize: true,
            level: 'info'
        }),
        new(require('winston-daily-rotate-file'))({
            filename: './Logs/employee.log',
            timestamp: tsFormat,
            datePattern: 'yyyy-MM-dd',
            prepend: true,
            level: env === 'development' ? 'verbose' : 'info'
        })
    ]
});

app.get('/',function(req, res) {

    logger.info('API requested Employee Data');

    var appData = {
        "error": 1,
        "data": ""
    };

    database.connection.getConnection(function(err, connection) {
        if (err) {
            appData["error"] = 1;
            appData["data"] = "Internal Server Error";
            res.status(500).json(appData);
            logger.error('Error Connecting DB');
        } else {
            connection.query("SELECT * FROM employee", function(err, rows, fields) {
                if (err) {
                    appData["data"] = "No data Found";
                    res.status(404).json(appData);
                    logger.warn('No data Found');
                } else {
                    appData.error = 0;
                    appData["data"] = rows;
                    res.status(200).json(appData);
                    logger.info('API returned data');
                }
            });
            connection.release();
        }
    });
});

app.get('/:eid', function(req, res) {

    logger.info('API requested for Employee Data by ID');

    var eid = req.params.eid;
    var appData = {
        "error": 1,
        "data": ""
    };

    database.connection.getConnection(function(err, connection) {
        if (err) {
            appData["error"] = 1;
            appData["data"] = "Internal Server Error";
            res.status(500).json(appData);
            logger.error('Error Connecting DB');
        } else {
            if (!!eid) {
                connection.query("SELECT *FROM employee WHERE eid = ?", [eid], function(err, rows, fields) {
                    if (err) {
                        appData["data"] = "No data Found";
                        res.status(404).json(appData);
                        logger.warn('No data Found');
                    } else {
                        appData["error"] = 0;
                        appData["data"] = rows;
                        res.status(200).json(appData);
                        logger.info('API returned data');
                    }
                });
                connection.release();
            } else {
                appData["data"] = "Please provide all required data";
                res.status(400).json(appData);
                logger.warn("Please provide all required data");
            }
        }
    });

});

app.post('/insert', function(req, res) {

    logger.info('API requested for Inserting Employee Data');

    var postData = req.body;

    var appData = {
        "error": 1,
        "data": ""
    };

    database.connection.getConnection(function(err, connection) {
        if (err) {
            appData["error"] = 1;
            appData["data"] = "Internal Server Error";
            res.status(500).json(appData);
            logger.error('Error Connecting DB');
        } else {
            connection.query("INSERT INTO employee SET?", postData, function(err, rows, fields) {

                if (!!err) {
                    console.log(err);
                    appData["data"] = "Error Adding data";
                    res.status(200).json(appData);
                    logger.error('Error Adding data');
                } else {
                    appData["error"] = 0;
                    appData["data"] = "Data Added Successfully";
                    res.status(201).json(appData);
                    logger.info('Data added Successfully');
                }
            });
            connection.release();
        }

    });
});

app.put('/update', function(req, res) {

    logger.info('API requested for Updating employee Data');

    var eid = req.body.eid;
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var age = req.body.age;

    var appData = {
        "error": 1,
        "data": ""
    };

    database.connection.getConnection(function(err, connection) {
        if (err) {
            appData["error"] = 1;
            appData["data"] = "Internal Server Error";
            res.status(500).json(appData);
            logger.error('Error Connecting DB');
        } else {

            if (!!eid) {
                connection.query("UPDATE employee SET first_name=?, last_name=?, age=? WHERE eid = ?", [first_name, last_name, age, eid], function(err, rows, fields) {

                    if (err) {
                        appData["data"] = "Cannot update Data";
                        res.status(200).json(appData);
                        logger.error('Cannot update Data');
                    } else {
                        appData["error"] = 0;
                        appData["data"] = "Data Updated Successfully";
                        res.status(201).json(appData);
                        logger.info('Data Updated Successfully');
                    }
                });
                connection.release();
            } else {
                appData["data"] = "Please provide all required data";
                res.status(400).json(appData);
                logger.warn("Please provide all required data");
            }
        }
    });

});

app.delete('/delete', function(req, res) {

    logger.info('API requested for Deleting Employee Data');

    var eid = req.body.eid;
    var appData = {
        "error": 1,
        "data": ""
    };

    database.connection.getConnection(function(err, connection) {
        if (err) {
            appData["error"] = 1;
            appData["data"] = "Internal Server Error";
            res.status(500).json(appData);
            logger.error('Error Connecting DB');
        } else {
            if (!!eid) {
                connection.query("DELETE FROM employee WHERE eid = ?", [eid], function(err, rows, fields) {

                    if (err) {
                        appData["data"] = "Cannot Delete data";
                        res.status(200).json(appData);
                        logger.error('Cannot Delete data');
                    } else {
                        appData["error"] = 0;
                        appData["data"] = "Data Deleted Successfully";
                        res.status(200).json(appData);
                        logger.info('Data Deleted Successfully');
                    }
                });
                connection.release();
            } else {
                appData["data"] = "Please provide all required data";
                res.status(400).json(appData);
                logger.warn("Please provide all required data");
            }
        }
    });
});

module.exports = app;