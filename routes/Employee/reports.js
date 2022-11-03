const express = require('express');
const router = express.Router();
const receptionUtil = require('../../utility/receptionUtility');
const ejs = require('ejs');
const puppeteer = require('puppeteer');
const path = require('path');

router.get('/daily', async (req, res) => {
    const data = await receptionUtil.getDailyReservationsReport();
    const pdfTemplate = await ejs.renderFile(path.normalize(path.join(__dirname, '../views/reports/daily.ejs')), { data }, { beautify: true, async: true });
    res.writeHead(200, { 'content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="dailyReport.pdf"' });
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(pdfTemplate);
    const buffer = await page.pdf({ format: "A4" });
    await browser.close();
    res.end(buffer);
});


router.get('/financial', async (req, res) => {
    const data = await receptionUtil.getFinancialReport();
    const pdfTemplate = await ejs.renderFile(path.normalize(path.join(__dirname, '../views/reports/financial.ejs')), { data }, { beautify: true, async: true });
    res.writeHead(200, { 'content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="financialReport.pdf"' });
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(pdfTemplate);
    const buffer = await page.pdf({ format: "A4" });
    await browser.close();
    res.end(buffer);
});

module.exports = router;