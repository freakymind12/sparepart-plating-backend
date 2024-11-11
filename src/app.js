require("dotenv").config();
const PORT = process.env.PORT || 5000;
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require('path');
// const apicache = require('apicache')

// import routing
const authRoutes = require("./routes/auth.js");
const usersRoutes = require("./routes/users.js");
const categoryRoutes = require("./routes/category.js");
const machineRoutes = require("./routes/machine.js");
const supplierRoutes = require("./routes/supplier.js");
const sparepartRoutes = require("./routes/sparepart.js");
const sparepartInRoutes = require("./routes/sparepartIn.js");
const sparepartOutRoutes = require("./routes/sparepartOut.js");
const uploadRoutes = require("./routes/upload.js");

// import middleware
const middlewareHandle = require("./middleware/middlewareHandle.js");
// const cache = apicache.middleware;
const app = express();

// Middleware used
app.use(middlewareHandle.errorMessage); // error message
app.use(middlewareHandle.logRequest); // log request
// app.use(middlewareHandle.allowCrossDomain) // allow cross domain for make a request to this api
app.use(cors());
// app.use(cache("2 minutes"));

// ALLOW JSON RESPONSE AND PUBLIC FOLDER
app.use(cookieParser());
app.use(express.json());
app.use(
  "/uploads/sparepart-drawing",
  express.static(path.join(__dirname, "uploads/sparepart-drawing"))
);

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/machine", machineRoutes);
app.use("/api/supplier", supplierRoutes);
app.use("/api/sparepart", sparepartRoutes);
app.use("/api/sparepart-incoming", sparepartInRoutes);
app.use("/api/sparepart-outgoing", sparepartOutRoutes);
app.use("/api/upload", uploadRoutes);

// Run service REST API
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
