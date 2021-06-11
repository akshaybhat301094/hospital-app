const express = require("express");
const cors = require("cors");

var app = express();
const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  const output = { value: "hello world" };
  res.send(output);
});

// Route for hospital controller
app.use("/hospital", require("./routes/api/hospital"));

// Route for department controller
app.use("/department", require("./routes/api/department"));

// default port running at 3000
app.listen(PORT, () => console.log(`server started at PORT ${PORT}....`));
