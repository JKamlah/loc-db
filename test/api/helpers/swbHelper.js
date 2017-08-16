/**
 * Created by anlausch on 16/8/2017.
 */
"use strict";

const should = require('should');
const setup = require('./../setup.js').createSetup();
const swbHelper = require('./../../../api/helpers/swbHelper').createSwbHelper();
const enums = require('./../../../api/schema/enum.json');

describe('helpers', function() {
    describe('swbHelper', function() {
        before(function(done) {
            setup.dropDB(function(err){
                done();
            });
        });

        after(function(done) {
            setup.dropDB(function(err){
                done();
            });
        });

        describe('queryByTitle', function(){
            this.timeout(3000)
            it('should return a result for a given query', function(done) {
                swbHelper.queryByTitle("Test", function(err, result){
                    result.should.be.ok;
                    result.should.be.Array;
                    result.should.have.lengthOf(10);
                    console.log(result);
                    done();
                });
            });
        });
    });
});