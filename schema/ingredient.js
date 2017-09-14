var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ingredientSchema = new Schema({
    name: String,
    degree: String,
    nutrients: String
});

module.exports = mongoose.model('ingredient', ingredientSchema);
