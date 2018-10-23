const should = require('should');
const setup = require('./../setup.js').createSetup();
const aPlusPlusHelper = require('./../../../api/helpers/aPlusPlusHelper.js').createAPlusPlusHelper();
const fs = require('fs');

describe('helpers', function() {
    describe('aPlusPlusHelper', function() {
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
        
        describe('parseFile', function(){
            it('should return a parsed bibliographic resource', function(done) {
                this.timeout(5000);
                aPlusPlusHelper.parseFile("./test/api/data/aPlusPlus/aPlusPlus.xml", function(result){
                    result.should.be.ok();
//                    result.should.have.property("title", "Der soziologische Blick :");
//                    result.should.have.property("subtitle", "vergangene Positionen und gegenwärtige Perspektiven /");
//                    result.should.have.property("publicationYear", 2002);
//                    result.should.have.property("contributors");
//                    result.should.have.property("identifiers");
//                    result.contributors.should.be.Array();
//                    result.contributors.should.have.length(1);
//                    result.contributors[0].should.have.property("roleType", "Publisher")
//                    result.identifiers.should.be.Array();
//                    result.contributors.should.have.length(1)
                    done();
                });
                
            });
        });
        
        describe('parseFiles', function(){
            it('should return a parsed bibliographic resource', function(done) {
                this.timeout(10000);
                aPlusPlusHelper.parseFiles("./test/api/data/aPlusPlus", function(result){
                    console.log("FERTIG: " + result.length);
                    
                    done();
                });
                
            });
        });
    });
});