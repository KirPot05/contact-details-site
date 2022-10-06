import puppeteer from "puppeteer";

export async function printPDF(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle0" });
  const pdf = await page.pdf({ format: "A4" });
  await page.addStyleTag({
    content:
      ".nav { display: none} .navbar { border: 0px} #print-button {display: none}",
  });

  await browser.close();
  return pdf;
}
