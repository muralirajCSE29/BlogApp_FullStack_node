const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser")
require("dotenv").config();
var cors = require("cors"); 
const cookieParser = require("cookie-parser");

const errorHandler = require('./middleware/error');

//import routes
const authRoutes = require('./routes/authRoutes');
const postRoute = require('./routes/postRoute');

//middleware

app.use(morgan('dev'));
app.use(bodyParser.json({ limit: "5mb"}));
app.use(bodyParser.urlencoded({
        limit : '5mb',
        extended : true
}));
app.use(cookieParser());
app.use(cors());

//routes MIDDLEWARE
app.use('/api', authRoutes);
app.use('/api', postRoute);

//error middleware
app.use(errorHandler);


//port
const port = process.env.PORT || 9000;

// MongoDB connection
const mongodbUri = process.env.MONGODB_URI;

mongoose.connect(mongodbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});


app.listen(port, ()=> {
    console.log(`Server running on port ${port} `);
})
    