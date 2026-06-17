import mongoose from "mongoose";


type ConnectionObject = {
    isConnected?: number // if come will come in number format
    // ? means that this property is optional because when we first start the application we don't have any connection to the database so it will be undefined
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> { // dbconnect function returning a promise
    if (connection.isConnected) {
        console.log("Already connected to database");
        return; // if we are already connected to the database then we don't need to connect again so we return from the function checking for connection choking
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "", {});// {} empty object for options we can add options like useNewUrlParser: true, useUnifiedTopology: true but in mongoose 6 these options are not required because they are set to true by default 

        connection.isConnected = db.connections[0].readyState; // readystate is a property of mongoose connection object that tells us the state of the connection returns a  number
        // db.connections is an array of all the connections that we have to the database and we are interested in the first connection because we are only connecting to one database so we access the first connection and then we access the readyState property of that connection to get the state of the connection and we store it in our connection object for future reference so that we can check if we are already connected to the database or not

        console.log("DB Connected Successfully");

    } catch (error) {
        console.log("Database connection failed", error);

        process.exit(1); // exit the process with failure code
        // we exit the process because if we can't connect to the database then we can't run the application so it's better to exit the process and fix the issue rather than running the application without a database connection 
    }
}

export default dbConnect;