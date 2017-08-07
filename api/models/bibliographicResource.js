
// The bibliographicResource model
const mongoose = require('mongoose')
       ,Schema = mongoose.Schema
       ,ObjectId = Schema.ObjectId;
const enums = require('./../schema/enum.json');
const mongoosastic = require('mongoosastic');

const brSchema = new Schema({
    identifiers: [{
        literalValue: String,
        scheme: String
    }],
    type: {type: String},
    title: String,
    subtitle: String,
    edition: String,
    number: Number, // e.g. number of an article in journal
    contributors: [{
        identifiers: [{
            literalValue: String,
            scheme: String
        }],
        roleType: String,
        heldBy:{
            identifiers: [{
                literalValue: String,
                scheme: String
            }],
            nameString: String,
            givenName: String,
            familyName: String
        },
        next: String // This is not necessary for now, as we are using an array
    }],
    publicationYear: Number,
    cites: [String], // reference entries
    partOf: String, // link to other br
    status: {type: String, enum: [enums.status.external, enums.status.valid]},
    parts: [{
        identifiers: [{
            literalValue: String,
            scheme: String
        }],
        bibliographicEntryText: String,
        references: String,
        scanId: String,
        status: {type: String, enum: [enums.status.ocrProcessed, enums.status.valid]},
        ocrData:{
            coordinates: String,
            authors: [String], // maybe use contributors thingy later
            title: String,
            date: String,
            marker: String,
            comments: String
        }
    }], // links to other brs
    embodiedAs: [{ // Resource Embodiment
        identifiers: [{
            literalValue: String,
            scheme: String
        }],
        type: {type: String}, // digital or print
        format: String, // IANA media type
        firstPage: Number,
        lastPage: Number,
        url: String,
        scans:[{
            scanName: String,
            xmlName: String,
            status: {type: String, enum: [enums.status.notOcrProcessed, enums.status.ocrProcessed, enums.status.valid]},
        }]
    }]
});

brSchema.plugin(mongoosastic);

module.exports = mongoose.model('br', brSchema);