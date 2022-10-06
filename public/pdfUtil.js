async function getPDF(url) {
  const res = await fetch("/pdf/generate", {
    method: "POST",
    headers: {
      Accept: "application/pdf",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url,
    }),
  });

  const pdfRes = await res.arrayBuffer();
  const pdfBlob = new Blob([pdfRes], {
    type: "application/pdf",
  });

  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(pdfBlob);
  link.download = new Date(Date.now()).toTimeString() + ".pdf";
  link.click();
}
