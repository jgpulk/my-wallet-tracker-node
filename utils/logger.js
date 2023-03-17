const { createLogger, format, transports, config } = require('winston');
require('winston-mongodb');

module.exports = createLogger({
    levels: config.syslog.levels,
    transports: [
        new transports.MongoDB({
            db: "mongodb+srv://"+process.env.MONGO_USERNAME+":"+process.env.MONGO_PASSWORD+"@mywallettracker-cluster.crytsby.mongodb.net/"+process.env.MONGO_DB,
            options: {
              useUnifiedTopology: true
            },
            metaKey: 'metadata' //store addintional data
        })
    ]
})