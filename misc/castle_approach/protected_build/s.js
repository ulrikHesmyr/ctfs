const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const submitButton = document.getElementById("submit");


async function logIn(){

    const request = await fetch("/api/adgang", {
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({username: usernameInput.value, password: passwordInput.value })
    })
    const response = await request.json();

    alert(response.message);
}

submitButton.addEventListener("click", ()=>{
    logIn();
})