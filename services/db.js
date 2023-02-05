var mongoose = require('mongoose');

mongoose.set('strictQuery', false);

// Database connetion
mongoose.connect("mongodb+srv://"+process.env.MONGO_USERNAME+":"+process.env.MONGO_PASSWORD+"@mywallettracker-cluster.crytsby.mongodb.net/"+process.env.MONGO_DB+"", {
    useNewUrlParser: true,
    useUnifiedTopology: true
    // useCreateIndex: true,
},
function(err){
    if(err){
        console.log("Connection to Database Failed !!!!");
        console.log(err);
    } else{
        console.log("Connected to MongoDB : "+process.env.MONGO_DB+" @Cloud-Server");
    }
});