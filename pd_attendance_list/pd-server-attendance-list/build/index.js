"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
/* eslint-disable import/first */
require('dotenv').config();
const cors_1 = __importDefault(require("cors"));
const firebaseFirestore_1 = require("./firebase_client/firebaseFirestore");
const firestore_1 = require("firebase/firestore");
const crypto = __importStar(require("crypto"));
// dotenv.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.urlencoded({ extended: true }));
const port = process.env.PORT;
const attendancesRef = (0, firestore_1.collection)(firebaseFirestore_1.db, "attendances_v00");
app.get("/", (req, res) => {
    res.send("Express + TypeScript Server anything cool");
});
app.post("/registerAttendee", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Got body:", req.body);
    yield (0, firestore_1.setDoc)((0, firestore_1.doc)(attendancesRef, crypto.randomUUID()), {
        name: req.body.name,
        date_day: parseInt(req.body.date_day),
        date_year: parseInt(req.body.date_year),
        date_month: parseInt(req.body.date_month),
        practice_type: req.body.practice_type,
    });
    res.sendStatus(200);
}));
app.post("/deleteAttendee", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Got body for deletion: ', req.body);
    const year = Number.parseInt(req.body.year);
    const day = Number.parseInt(req.body.day);
    const month = Number.parseInt(req.body.month);
    const querySnapshotToDelete = yield fetchQuerySnapshot(year, day, month);
    querySnapshotToDelete.forEach((doc) => __awaiter(void 0, void 0, void 0, function* () {
        if (doc.id === req.body.id) {
            console.log('checking snapshot to delete');
            console.log(doc.data.toString());
            yield (0, firestore_1.deleteDoc)(doc.ref);
            console.log(`deleted document with id=${doc.id}`);
        }
    }));
    const jsonResult = yield fetchAttendessInJSONResult(year, day, month);
    console.log("being called after delete Attendee");
    console.log(jsonResult);
    res.send(jsonResult);
}));
app.get("/read", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const date = new Date();
    console.log("checking the request body", req.query);
    console.log(date.getFullYear(), date.getDate(), date.getDay());
    const year = Number.parseInt(req.query.year);
    const day = Number.parseInt(req.query.day);
    const month = Number.parseInt(req.query.month);
    const jsonResult = yield fetchAttendessInJSONResult(year, day, month);
    console.log("being called");
    console.log(jsonResult);
    res.send(jsonResult);
}));
function fetchAttendessInJSONResult(year, day, month) {
    return __awaiter(this, void 0, void 0, function* () {
        const querySnapshot = yield fetchQuerySnapshot(year, day, month);
        const results = [];
        querySnapshot.forEach((doc) => {
            results.push(Object.assign(Object.assign({}, doc.data()), { id: doc.id }));
        });
        const jsonResult = JSON.stringify(results);
        return jsonResult;
    });
}
function fetchQuerySnapshot(year, day, month) {
    return __awaiter(this, void 0, void 0, function* () {
        const q = (0, firestore_1.query)(attendancesRef, (0, firestore_1.where)("date_year", "==", year), (0, firestore_1.where)("date_day", "==", day), (0, firestore_1.where)("date_month", "==", month));
        const querySnapshot = yield (0, firestore_1.getDocs)(q);
        return querySnapshot;
    });
}
// module.exports = app;
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
