const { createLogger, format, transports, config } = require('winston');
require('winston-mongodb');

const dbLogger = createLogger({
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

const fileLogger = createLogger({
    levels: config.syslog.levels,
    transports: [
        new transports.File({ 
            filename: 'logs/server.log',
            format: format.combine(
                format.timestamp({format: 'MMM-DD-YYYY HH:mm:ss'}),
                format.align(),
                format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
            )
        })
    ]
})

module.exports = {
    dbLogger,
    fileLogger
}