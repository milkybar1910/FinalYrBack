require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
// const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//My routes
const authRoutes = require("./routes/auth");
const studentRoutes = require("./routes/student");
const internshipRoutes = require("./routes/Internship");
const workshopRoutes = require("./routes/Workshop");
const courseRoutes = require("./routes/Online_Course");
const DynamicRoutes = require("./routes/DynamicForm");
const jobRoutes = require("./routes/JobLetter");
const toggleRoutes = require("./routes/Toggle");
//DB Connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB CONNECTED");
  });

//Middlewares
// app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ limit: "50mb" }));

//My Routes
app.use("/api", authRoutes);
app.use("/api", studentRoutes);
app.use("/api", internshipRoutes);
app.use("/api", workshopRoutes);
app.use("/api", courseRoutes);
app.use("/api", DynamicRoutes);
app.use("/api", jobRoutes);
app.use("/api", toggleRoutes);

//PORT
const port = process.env.PORT || 8000;

//Starting a server
app.listen(port, () => {
  console.log(`app is running at ${port}`);
});
