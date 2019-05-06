const mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://rakon1:123@cluster0-8apqr.mongodb.net/MongoDb-Auth
?retryWrites=true`,{
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() =>{
  console.log('connected to database');
}).catch(() =>{
  console.log('failed connected to database');
});