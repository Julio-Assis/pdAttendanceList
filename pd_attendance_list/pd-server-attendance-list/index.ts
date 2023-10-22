import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
/* eslint-disable import/first */
require('dotenv').config();
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
  deleteDoc,
  DocumentData,
  QuerySnapshot,
} from "firebase/firestore";
import * as crypto from "crypto";

// dotenv.config();

const app: Express = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
const port = process.env.PORT;

const attendancesRef = collection(db, "attendances_v00");

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server anything cool");
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

app.post("/deleteAttendee", async (req: Request, res: Response) => {
  console.log('Got body for deletion: ', req.body);
  const year = Number.parseInt(req.body.year as string);
  const day = Number.parseInt(req.body.day as string);
  const month = Number.parseInt(req.body.month as string);

  const querySnapshotToDelete = await fetchQuerySnapshot(
    year,
    day,
    month
  );

  querySnapshotToDelete.forEach(async (doc) => {
    if (doc.id === req.body.id) {
      console.log('checking snapshot to delete');
      console.log(doc.data.toString());

      await deleteDoc(doc.ref);
      console.log(`deleted document with id=${doc.id}`);
    }
  });

  const jsonResult = await fetchAttendessInJSONResult(year, day, month);
  console.log("being called after delete Attendee");
  console.log(jsonResult);
  res.send(jsonResult);
});

app.get("/read", async (req: Request, res: Response) => {
  const date = new Date();
  console.log("checking the request body", req.query);
  console.log(date.getFullYear(), date.getDate(), date.getDay());

  const year = Number.parseInt(req.query.year as string);
  const day = Number.parseInt(req.query.day as string);
  const month = Number.parseInt(req.query.month as string);

  const jsonResult = await fetchAttendessInJSONResult(year, day, month);
  console.log("being called");
  console.log(jsonResult);
  res.send(jsonResult);
});

async function fetchAttendessInJSONResult(year: number, day: number, month: number): Promise<string> {
  const querySnapshot = await fetchQuerySnapshot(
    year,
    day,
    month
  );

  const results: Array<DocumentData> = [];
  querySnapshot.forEach((doc) => {

    results.push({
      ...doc.data(),
      id: doc.id
    });
  });

  const jsonResult = JSON.stringify(results);
  return jsonResult;
}

async function fetchQuerySnapshot(
  year: number,
  day: number,
  month: number
): Promise<QuerySnapshot<DocumentData, DocumentData>> {
  const q = firestoreQuery(
    attendancesRef,
    firestoreWhere("date_year", "==", year),
    firestoreWhere("date_day", "==", day),
    firestoreWhere("date_month", "==", month)
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot;
}

// module.exports = app;

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
