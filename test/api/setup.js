"use strict";
const config = require("./config.js");
const mongoose = require('mongoose');
const br = require('./../../api/models/bibliographicResource.js');
const user = require('./../../api/models/user.js');
const signup = require('./../../api/controllers/user.js').findOrCreateUser;
const dataBibliographicResource = require('./data/bibliographicResource');
const dataBibliographicEntry = require('./data/bibliographicEntry');
const dataToDo = require('./data/todo.json');
const nock = require('nock');


var Setup = function(){};


Setup.prototype.loadBibliographicResources = function(){
    br.remove({}, function(err, res){
        if(err) console.log(err);
        for (var bibliographicResource of dataBibliographicResource){
            new br(bibliographicResource).save(function(err, res){
                if(err) console.log(err);
            });
        }
    });

};


Setup.prototype.loadBibliographicEntry = function(){
    br.remove({}, function(err, res){
        if(err) console.log(err);
        for (var bibliographicResource of dataBibliographicEntry) {
            new br(bibliographicResource).save(function (err, res) {
                if (err) console.log(err);
            });
        }
    });

};

Setup.prototype.loadAdditionalToDo = function(){
    for (var bibliographicResource of dataToDo) {
        new br(bibliographicResource ).save(function (err, res) {
            if (err) console.log(err);
        });
    }
};

Setup.prototype.mockOcrServer = function(){
    var ocrNock = nock('http://akanshaocr.de')
        .post('/', function(body, something){
            console.log(typeof body);
            return true;
        })
        .replyWithFile(200, __dirname + '/data/ocr_example_1/Output021511065733891448X_Verf_Literatruverz.pdf-14.png.xml');
};

Setup.prototype.dropDB = function(){
    br.remove({}, function(err) {
        console.log('Collection BR removed');
    });
    user.remove({}, function(err) {
        console.log('Collection User removed');
    });
};

Setup.prototype.login = function(agent,callback){
    var dummy = {
        username: "dummy",
        password: "dummy"
    };

    signup(dummy.username, dummy.password, function(err, res){
        if(err){
            return console.log(err);
        }
        else{
            agent
                .post('/login')
                .send(dummy)
                .end(function (err, res) {
                    if(err){
                        return callback(err, null);
                    }
                    return callback(null, agent);
                });
        }
    });


};


function createSetup(){
    return new Setup();
}


module.exports = {
        createSetup : createSetup
};
