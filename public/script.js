const detailsForm = document.getElementById("user-form");
if (detailsForm) {
  detailsForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // fields for API Call
    const name = document.getElementById("name").value;
    const contactNumber = document.getElementById("contact_num").value;

    // Validation
    let phone = /^\d{10}$/;
    if (!contactNumber.match(phone)) alert("Enter a valid phone number");

    // API call
    const res = saveRecords({
      name,
      contactNumber,
    })
      .then((data) => {
        // Checking for data already present in DB
        if (!data?.success) {
          alert(data?.message);
          return;
        } else {
          alert(data?.message);
        }

        const record = {
          token: data?.response.token,
          name: data?.response.name,
          contactNumber: data?.response.contactNumber,
        };

        // Dynamic Adding of data to table
        const tableBody = document.getElementById("details-table-body");
        const newRow = document.createElement("tr");

        Object.values(record).forEach((val) => {
          let cell = document.createElement("td");
          cell.innerText = val;
          newRow.append(cell);
        });
        tableBody.append(newRow);
      })
      .catch((err) => {
        console.log(err);
        alert("Error while saving the record");
      });
  });
}

async function saveRecords(record) {
  const res = await fetch("/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(record),
  });

  const recordRes = await res.json();
  return recordRes;
}
