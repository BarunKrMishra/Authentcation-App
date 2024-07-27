
const express = require("express")
const app = express();

require ("dotenv").config();
const PORT = process.env.PORT || 3000;


//cookie-parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());



app.use(express.json());

require("./config/database").connect();


//routes import and mount
const user = require("./route/user.js")

app.use("/api/v1" ,user);


app.listen(PORT, () => {
    console.log(`APP IS LISTEN ATT ${PORT}`);
})