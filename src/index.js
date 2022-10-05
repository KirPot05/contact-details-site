import express from "express";
import expressLayouts from "express-ejs-layouts";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import indexRouter from "./routes/index.js";
import authRouter from "./routes/auth.js";
import adminRouter from "./routes/admin.js";
import { dbConnect } from "./utils/index.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Getting Present working directory;
const fileName = fileURLToPath(import.meta.url);
const __dirname = dirname(fileName);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", "layouts/layout");

app.use(expressLayouts);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/", indexRouter);
app.use("/api/auth", authRouter);
app.use("/admin", adminRouter);

app.all("*", (req, res) => {
  res.redirect("/");
});

// Connection to MongoDB
dbConnect();
app.listen(PORT, () => {
  console.log("Server listening");
});
