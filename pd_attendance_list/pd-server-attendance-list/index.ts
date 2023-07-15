import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import { db } from "./firebase_client/firebaseFirestore";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  query as firestoreQuery,
  where as firestoreWhere,
  getDocs,
  DocumentData,
} from "firebase/firestore";
import * as crypto from "crypto";

dotenv.config();

const app: Express = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
const port = process.env.PORT;

const attendancesRef = collection(db, "attendances_v00");

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server anything cool");
});

app.get("/write", async (req: Request, res: Response) => {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      first: "Ada",
      last: "Lovelace",
      born: 1815,
    });
    console.log("Document written with ID: ", docRef.id);
    res.send("We wrote ID " + docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
    res.send("We failed with " + e);
  }
});

app.post("/registerAttendee", async (req: Request, res: Response) => {
  console.log("Got body:", req.body);
  await setDoc(doc(attendancesRef, crypto.randomUUID()), {
    name: req.body.name,
    date_day: parseInt(req.body.date_day),
    date_year: parseInt(req.body.date_year),
    date_month: parseInt(req.body.date_month),
    practice_type: req.body.practice_type,
  });
  res.sendStatus(200);
});

async function writeBaseUsers() {
  const date = new Date();

  await setDoc(doc(attendancesRef, crypto.randomUUID()), {
    name: "Julio",
    date_day: date.getDate(),
    date_year: date.getFullYear(),
    date_month: date.getMonth(),
    practice_type: "all_practice",
  });
  await setDoc(doc(attendancesRef, crypto.randomUUID()), {
    name: "Anja",
    date_day: date.getDate(),
    date_year: date.getFullYear(),
    date_month: date.getMonth(),
    practice_type: "black_practice",
  });
  await setDoc(doc(attendancesRef, crypto.randomUUID()), {
    name: "Laura",
    date_day: date.getDate(),
    date_year: date.getFullYear(),
    date_month: date.getMonth(),
    practice_type: "all_practice",
  });
}

app.get("/read", async (req: Request, res: Response) => {
  const date = new Date();
  const q = firestoreQuery(
    attendancesRef,
    firestoreWhere("date_year", "==", date.getFullYear()),
    firestoreWhere("date_day", "==", date.getDate()),
    firestoreWhere("date_month", "==", date.getMonth())
  );

  const querySnapshot = await getDocs(q);

  const results: Array<DocumentData> = [];
  const result = querySnapshot.forEach((doc) => {
    results.push(doc.data());
  });
  const jsonResult = JSON.stringify(results);
  console.log("being called");
  console.log(jsonResult);
  res.send(jsonResult);
});

module.exports = app;

// app.listen(port, () => {
//   console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
// });
