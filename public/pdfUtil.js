async function getPDF(url) {
  const res = await fetch("/pdf/generate", {
    method: "POST",
    headers: {
      Accept: "application/pdf",
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
  link.download = "new-doc.pdf";
  link.click();
}
