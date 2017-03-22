"use strict";

const marc4js = require('marc4js');
const enums = require('./../schema/enum.json');

var Marc21Helper = function(){
}


/**
 * Parses a given String in MARC21 format and returns a bibliographic resource
 * 
 * 
 */
Marc21Helper.prototype.parseBibliographicResource = function(xmlString, fnCallback){
    //console.log(xmlString);
    marc4js.parse(xmlString, {format: 'marcxml'}, function(err, records) {
        if(typeof records[1] == "undefined"){
            fnCallback(null);
            return;
        }

        var dataFields = records[1]._dataFields;
        var controlFields = records[1]._controlFields;
        var leader = records[1]._leader;

        var cleanedObject = {};
        cleanedObject.identifiers = [];
        cleanedObject.contributors = [];

        for(var field of dataFields){
            //Titles
            if(field._tag == "245"){
                for(var subfield of field._subfields){
                    if(subfield._code == "a"){
                        cleanedObject.title = subfield._data;
                    }else if(subfield._code == "b"){
                        cleanedObject.subtitle = subfield._data;
                    }
                }
            // Identifiers
            }else if(field._tag == "020"){
                for(var subfield of field._subfields){
                    if(subfield._code == "a"){
                        cleanedObject.identifiers.push({"literalValue": subfield._data,
                                "scheme": "ISBN"});
                    }
                }
            }else if(field._tag == "022"){
                for(var subfield of field._subfields){
                    if(subfield._code == "a"){
                        cleanedObject.identifiers.push({"literalValue": subfield._data,
                                "scheme": "ISSN"});
                    }
                }
            }else if(field._tag == "024"){
                for(var subfield of field._subfields){
                    if(subfield._code == "a"){
                        cleanedObject.identifiers.push({"literalValue": subfield._data,
                                "scheme": "TBD"});
                    }
                }
            }
            //Genre/Form
            else if(field._tag == "655"){
                for(var subfield of field._subfields){
                    if(subfield._code == "a"){
                        cleanedObject.type = subfield._data;
                    }
                }
            // Edition
            }else if(field._tag == "250"){
                for(var subfield of field._subfields){
                    if(subfield._code == "a"){
                        cleanedObject.edition = subfield._data;
                    }
                }
            // Number
            }else if(field._tag == "773"){
                for(var subfield of field._subfields){
                    if(subfield._code == "g"){
                        cleanedObject.number = subfield._data;
                    }
                }
            // Contributors
            }else if(field._tag == "100"){
                for(var subfield of field._subfields){
                    if(subfield._code == "a"){
                        var contributor = {};
                        contributor.roleType = enums.roleType.author;
                        contributor.heldBy = {};
                        contributor.heldBy.identifiers = [];
                        contributor.heldBy.nameString = subfield._data;
                        var nameArray = subfield._data.split(',');
                        contributor.heldBy.givenName =  nameArray[1] ? nameArray[1].trim() : "";
                        contributor.heldBy.familyName =  nameArray[1] ? nameArray[0].trim() : "";
                        cleanedObject.contributors.push(contributor);
                    }
                }
            }else if(field._tag == "110"){
                for(var subfield of field._subfields){
                    if(subfield._code == "a"){
                        var contributor = {};
                        contributor.roleType = enums.roleType.corporate;
                        contributor.heldBy = {};
                        contributor.heldBy.identifiers = [];
                        contributor.heldBy.nameString = subfield._data;
                        cleanedObject.contributors.push(contributor);
                    }
                }
            }else if(field._tag == "111"){
                for(var subfield of field._subfields){
                    if(subfield._code == "a"){
                        var contributor = {};
                        contributor.roleType = enums.roleType.congress;
                        contributor.heldBy = {};
                        contributor.heldBy.identifiers = [];
                        contributor.heldBy.nameString = subfield._data;
                        cleanedObject.contributors.push(contributor);
                    }
                }
            }else if(field._tag == "260"){
                for(var subfield of field._subfields){
                    if(subfield._code == "b"){
                        var contributor = {};
                        contributor.roleType = enums.roleType.publisher;
                        contributor.heldBy = {};
                        contributor.heldBy.identifiers = [];
                        contributor.heldBy.nameString = subfield._data;
                        cleanedObject.contributors.push(contributor);
                    }
                }
            }else if(field._tag == "264"){
                for(var subfield of field._subfields){
                    if(subfield._code == "b"){
                        var contributor = {};
                        contributor.roleType = enums.roleType.publisher;
                        contributor.heldBy = {};
                        contributor.heldBy.identifiers = [];
                        contributor.heldBy.nameString = subfield._data;
                        cleanedObject.contributors.push(contributor);
                    }
                }
            }
        }
        
        // publicationYear
        for(var field of controlFields){
            if(field._tag == "008"){
                cleanedObject.publicationYear = Number(field._data.substring(7,11));
            }
        }
        
        //LEADER
        if(leader._typeOfRecord && leader._typeOfRecord.toLowerCase() == "m"){
            //TODO: Fix this mess --> adapt to new data model!
            // cleanedObject.embodiedAs = "Digital";
        }else if(leader._typeOfRecord 
                && (leader._typeOfRecord.toLowerCase() == "a" 
                || leader._typeOfRecord.toLowerCase() == "c" 
                || leader._typeOfRecord.toLowerCase() == "e")){
           // cleanedObject.embodiedAs = "Print";
        }else if(leader._bibliographicLevel && leader._bibliographicLevel.toLowerCase() == "a"){
            //TODO: Fix this mess --> adapt to new data model!
            //cleanedObject.type = "Monograph";
        }else if(leader._bibliographicLevel && leader._bibliographicLevel.toLowerCase() == "s"){
            //TODO: Fix this mess --> adapt to new data model!
            //cleanedObject.type = "Serial";
        }
        //console.log(leader);
        fnCallback(cleanedObject);
    });
}


/**
 * Factory function
 *
 * @returns {Marc21Helper}
*/
function createMarc21Helper() {
    return new Marc21Helper();
}


module.exports = {
        createMarc21Helper : createMarc21Helper
};