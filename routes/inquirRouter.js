import express from  "express";
import { addInquiry, deleteInquiry, getInquiries, updateInquiry } from "../controllers/inquiryController.js";

const inquiriesRouter = express.Router();

inquiriesRouter.post("/", addInquiry);
inquiriesRouter.get("/", getInquiries);
inquiriesRouter.put("/:id", updateInquiry);
inquiriesRouter.delete("/:id", deleteInquiry);

export default inquiriesRouter;
