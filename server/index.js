const database = require("./db/database");
const express = require("express");
const cors = require('cors')
const app = express();
const mainRouter = require("./routes/user");
const {cloudinaryConnect} = require("./db/cloudinaryConnect");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

require("dotenv").config();
require('express-async-errors');

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: "*",
    credentials: true,
}))
app.use("/api/v1", mainRouter);

const PORT = process.env.PORT || 4000;
app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: "/tmp/",
	})
);

// Connecting to cloudinary
cloudinaryConnect();
//connect to database
database.connect();

// Listening to the server
app.listen(PORT, () => {
	console.log(`App is listening at ${PORT}`);
});

// End of code.
