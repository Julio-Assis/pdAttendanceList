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
const dotenv_1 = __importDefault(require("dotenv"));
const firebaseFirestore_1 = require("./firebase_client/firebaseFirestore");
const firestore_1 = require("firebase/firestore");
const crypto = __importStar(require("crypto"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
const attendancesRef = (0, firestore_1.collection)(firebaseFirestore_1.db, "attendances_v00");
app.get("/", (req, res) => {
    res.send("Express + TypeScript Server anything cool");
});
app.get("/write", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const docRef = yield (0, firestore_1.addDoc)((0, firestore_1.collection)(firebaseFirestore_1.db, "users"), {
            first: "Ada",
            last: "Lovelace",
            born: 1815,
        });
        console.log("Document written with ID: ", docRef.id);
        res.send("We wrote ID " + docRef.id);
    }
    catch (e) {
        console.error("Error adding document: ", e);
        res.send("We failed with " + e);
    }
}));
function writeBaseUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        const date = new Date();
        yield (0, firestore_1.setDoc)((0, firestore_1.doc)(attendancesRef, crypto.randomUUID()), {
            name: "Julio",
            date_day: date.getDate(),
            date_year: date.getFullYear(),
            date_month: date.getMonth(),
            practice_type: "all_practice",
        });
        yield (0, firestore_1.setDoc)((0, firestore_1.doc)(attendancesRef, crypto.randomUUID()), {
            name: "Anja",
            date_day: date.getDate(),
            date_year: date.getFullYear(),
            date_month: date.getMonth(),
            practice_type: "black_practice",
        });
        yield (0, firestore_1.setDoc)((0, firestore_1.doc)(attendancesRef, crypto.randomUUID()), {
            name: "Laura",
            date_day: date.getDate(),
            date_year: date.getFullYear(),
            date_month: date.getMonth(),
            practice_type: "all_practice",
        });
    });
}
app.get("/read", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const date = new Date();
    const q = (0, firestore_1.query)(attendancesRef, (0, firestore_1.where)("date_year", "==", date.getFullYear()), (0, firestore_1.where)("date_day", "==", date.getDate()), (0, firestore_1.where)("date_month", "==", date.getMonth()));
    const querySnapshot = yield (0, firestore_1.getDocs)(q);
    const results = [];
    const result = querySnapshot.forEach((doc) => {
        results.push(doc.data());
    });
    res.send(JSON.stringify(results));
}));
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
