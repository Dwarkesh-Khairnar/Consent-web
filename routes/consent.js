// -------------------- routes/consent.js --------------------
const express = require("express");
const Consent = require("../models/Consent");
const User = require("../models/user");
const PDFDocument = require('pdfkit');
const router = express.Router();

function isAuthenticated(req, res, next) {
  if (req.session.userId) return next();
  res.redirect("/");
}

router.get("/dashboard", isAuthenticated, async (req, res) => {
  const user = await User.find({ userId:req.session.userId });
  const consents = await Consent.find({ userId: req.session.userId });
  res.render("dashboard", { consents, user });
  console.log('consent' + consents+ 'user' + user);

});

router.post("/add", isAuthenticated, async (req, res) => {
  const { website, email, dataShared, purpose, consentGiven } = req.body;
  await Consent.create({
    userId: req.session.userId,
    website,
    email,
    dataShared: dataShared.split(","),
    purpose,
    consentGiven: consentGiven === "true",
  });
  res.redirect("/consent/dashboard");
});

router.get("/delete/:id", isAuthenticated, async (req, res) => {
  await Consent.deleteOne({ _id: req.params.id });
  res.redirect("/consent/dashboard");
});

router.get("/export", isAuthenticated, async (req, res) => {

  try {
    const consents = await Consent.find({ userId: req.session.userId });
    const doc = new PDFDocument();

    res.setHeader("Content-Disposition", `attachment; filename=${req.session.username}.pdf`);
    res.setHeader("Content-Type", "application/pdf");
    doc.pipe(res);
    doc.fontSize(20).text('Your consent Dashboard export', { align: 'center' });
    doc.moveDown();

    if (consents && consents.length > 0) {
      doc.fontSize(12).text('Here is list of your consent:');
      doc.moveDown()

      consents.forEach((consent, index) => {
        doc.fontSize(10).text(`Consent ${index + 1}:`);
        doc.text(`Website/company:${consent.website || 'N/A'}`);
        doc.text(`User Email:${consent.email || 'N/A'}`);
        doc.text(`which type of data is shared:${consent.dataShared || 'N/A'}`);
        doc.text(`Purpose of data sharing:${consent.purpose || 'N/A'}`);
        doc.text(`Given:${consent.consentGiven ? 'yes' : 'NO'}`);
        doc.moveDown()
      });
    } else {
      doc.fontSize(12).text('No consents found for your account.')
    }
    doc.end();
  } catch (error) {
    console.error("Error geneating or exporting Pdf:", error);
    res.status(500).send("Error exporting data.")
  }



  const nodemailer = require('nodemailer');

  const transporter = nodemailer.createTransport(
    {
      secure: true,
      host: 'smtp.gmail.com',
      post: 465,
      auth: {
        user: 'test@mail.com',            // change with Company mail
        pass: 'jhvcsdhvdwhv'              // Create in smtp server
      }
    }
  );

  function sendmail(to, sub, msg) {
    transporter.sendMail({
      to: to,
      subject: sub,
      html: msg
    });
  }
  sendmail(`${consent.email}`, ``, 'mail cude not send send again!')

});

module.exports = router;

