const express = require("express");
const certificateController = require("../controllers/certificateController");

const router = express.Router();

router.post("/", certificateController.createCertificate);

router.put("/:certificateId", certificateController.updateCertificate);

router.delete("/:certificateId", certificateController.deleteCertificate);

router.get("/", certificateController.getAllCertificates);

router.get("/:certificateId", certificateController.getCertificateById);

module.exports = router;
