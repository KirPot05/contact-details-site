import { Router } from "express";
import Records from "../models/record.js";
import { printPDF } from "../utils/generatePDF.js";
import { getNextSequenceValue } from "../utils/index.js";
import { failed_response, success_response } from "../utils/response.js";

const router = Router();

router.get("/", (req, res) => {
  try {
    res.render("index");
  } catch (err) {
    console.log(err);
    res.status(500).json(failed_response(500, "Something went wrong"));
  }
});

router.get("/user", async (req, res) => {
  try {
    let records = await Records.find();
    if (records.length === 0) throw new Error("No records found");
    records = records.slice(1);

    const users = new Set();

    records.forEach((record) => {
      users.add(record.name);
    });

    let userRecords = {};
    users.forEach((user) => {
      const details = records.filter((record) => record.name === user);
      userRecords[user] = details;
    });

    if (req.query.name) {
      userRecords = userRecords[req.query.name];
      return res.status(200).render("userPDF.ejs", {
        userRecords,
        userName: req.query.name,
      });
    }

    res.render("user", {
      userRecords,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(failed_response(500, "Something went wrong"));
  }
});

router.post("/pdf/generate", async (req, res) => {
  try {
    console.log(req.body);
    const pdf = await printPDF(req.body.url);

    res
      .status(200)
      .set({
        "Content-Type": "application/pdf",
        "Content-Length": pdf.length,
      })
      .send(pdf);
  } catch (err) {}
});

router.post("/add", async (req, res) => {
  try {
    const body = {
      token: await getNextSequenceValue(),
      name: req.body.name,
      contactNumber: req.body.contactNumber,
    };
    let record = await Records.find({ contactNumber: req.body.contactNumber });
    if (record !== null) {
      const message = "Record already exists!";
      const result = failed_response(400, message);
      return res.status(400).json(result);
    }

    record = await Records.create(body);
    const result = success_response(200, "Record created successfully", record);
    return res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

export default router;
