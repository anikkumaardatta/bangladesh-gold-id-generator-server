const { mongoose } = require("mongoose")
const { mongoDBCompassUrl } = require("../secret")

const connectDB = async (options = {}) =>{
    try {
        // connection logics here
        await mongoose.connect(mongoDBCompassUrl, options);
        console.log(`Connected to MongoDB - ${mongoDBCompassUrl}`);
        mongoose.connection.on("error", (error)=>{
            console.error(`Database connecting error", ${error}`);
        })
        
    } catch (error) {
        console.error(`Could't connect to DB - ${error.toString()}`);
    }
}

module.exports = connectDB;