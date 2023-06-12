import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/Database.js";
import SequelizeStore from "connect-session-sequelize";
import UserRoute from "./routes/UserRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import ChatRoute from "./routes/ChatRoute.js";
import RepairShopsRoute from "./routes/RepairShopsRoute.js";
import OperationalScheduleRoute from "./routes/OperationalScheduleRoute.js";
import ChatChannelRoute from "./routes/ChatChannelRoute.js";
dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
  db: db,
});

//Database Sync
// (async () => {
//   await db.sync();
// })();

app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      secure: "auto",
    },
  })
);

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5000",
  })
);
app.use(express.json());
app.use(UserRoute);
app.use(AuthRoute);
app.use(ChatRoute);
app.use(RepairShopsRoute);
app.use(OperationalScheduleRoute);
app.use(ChatChannelRoute);

// store.sync();

app.listen(process.env.APP_PORT, () => {
  console.log("Server up and running...");
});
