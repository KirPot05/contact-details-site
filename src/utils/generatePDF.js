import puppeteer from "puppeteer";

export async function printPDF(url) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle0" });
  const pdf = await page.pdf({
    format: "A4",
    margin: {
      top: "50px",
      right: "100px",
      bottom: "50px",
      left: "100px",
    },
  });

  await browser.close();
  return pdf;
}
