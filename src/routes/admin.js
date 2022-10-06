import { Router } from "express";
import Records from "../models/record.js";
import { failed_response } from "../utils/response.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    let allRecords = await Records.find();

    if (req.query.token) {
      allRecords = allRecords.filter((record) => {
        return record.token === Number(req.query.token);
      });
      return res.status(200).render("adminPDF", {
        records: allRecords,
      });
    }

    res.status(200).render("admin", {
      records: allRecords.slice(1),
    });
  } catch (err) {
    console.log(err);
    const message = "Something went wrong";
    const result = failed_response(500, message);
    res.status(500).json(result);
  }
});

export default router;
