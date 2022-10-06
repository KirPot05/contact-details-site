// if (
//   localStorage.getItem("auth-token") === null &&
//   window.location.pathname !== "/" &&
//   window.location.pathname !== "/api/auth"
// ) {
//   window.location.replace("/");
//   alert("Please Sign in before continuing");
// }
const loginBtn = document.getElementById("login__btn");
if (loginBtn !== null) {
  loginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (localStorage.getItem("auth-token") !== null) {
      window.location.replace("/user");
    } else {
      window.location.replace("/api/auth?op=login");
    }
  });
}

function logOut() {
  localStorage.removeItem("auth-token");
  window.location.replace("/api/auth?op=login");
}

const loginForm = document.getElementById("login_form");
const registerForm = document.getElementById("register_form");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("user-email").value;
    const password = document.getElementById("user-password").value;

    authOperation(
      {
        email,
        password,
      },
      "login"
    )
      .then((data) => {
        console.log(data);
        if (data?.success) {
          localStorage.setItem("auth-token", data?.response);
          alert(data?.message);
          window.location.replace("/user");
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Error while signing in!");
      });
  });
}

if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("user-name").value;
    const email = document.getElementById("user-email").value;
    const password = document.getElementById("user-password").value;

    authOperation(
      {
        name,
        email,
        password,
      },
      "register"
    )
      .then((data) => {
        console.log(data);
        if (data?.success) {
          localStorage.setItem("auth-token", data?.response);
          alert(data?.message);
          window.location.replace("/user");
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Error while signing in!");
      });
  });
}

async function authOperation(credentials, operation) {
  try {
    let pathUrl = "";
    if (operation === "login") pathUrl = "/api/auth/login";
    else if (operation === "register") pathUrl = "/api/auth/create";
    else throw new Error("Operation not supported");

    const res = await fetch(pathUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const response = await res.json();
    if (!response?.success) throw new Error(response?.message);
    console.log(response);
    return response;
  } catch (err) {
    console.log(err);
    alert(err);
  }
}
