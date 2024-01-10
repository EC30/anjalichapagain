// import axios from "axios";

// // const baseurl="http://localhost:8000/auth";

// const signUpUsername=document.getElementById("signup-username") as HTMLInputElement;
// const signUpFullname=document.getElementById("signup-fullname") as HTMLInputElement;
// const signUpEmail=document.getElementById("signup-email") as HTMLInputElement;
// const signUpPassword=document.getElementById("signup-password") as HTMLInputElement;
// const signUpCPassword=document.getElementById("signup-confirm-password") as HTMLInputElement;
// const signUpButton=document.getElementById("signup") as HTMLButtonElement;

// signUpButton.addEventListener("click", async(event)=>{
//     event.preventDefault();
//     const username=signUpUsername.value;
//     const fullname=signUpFullname.value;
//     const email=signUpEmail.value;
//     const password=signUpPassword.value;
    
//     if (password !== signUpCPassword.value) {
//         alert("Password and Confirm Password do not match");
//         return;
//     } 
//     try{
//         const response=await axios.post("http://localhost:8000/auth/signup",
//             {
//                 username:username,
//                 fullname:fullname,
//                 email:email,
//                 password:password
//             });
//         console.log(response);
//     }catch(error){
//         console.log(error);
//     }

// });

import axios from "axios";
const signInUsername = document.getElementById("signin-username") as HTMLInputElement;
const signInPassword = document.getElementById("signin-password") as HTMLInputElement;
const loginButton = document.getElementById("login") as HTMLButtonElement;
const loginErrorMessage=document.getElementById("login-error-message") as HTMLDivElement;

loginButton.addEventListener("click", async (event) => {
    event.preventDefault();
    try{
        const username=signInUsername.value;
        const password=signInPassword.value;
        const response = await axios.post("http://localhost:8000/auth/login", {
            username,
            password,
        });
        const accessToken = response.data.accessToken;
        const userData=response.data.user;
        console.log("Login successful");
        console.log("Token:", accessToken);
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        // document.cookie = `currentUserData=${userData}; path=/`;
        sessionStorage.setItem("user", JSON.stringify(userData));
        window.location.href="./src/views/dashboard/dashboard.html";
    }catch(error){
        console.log("Login failed");
        loginErrorMessage.style.display="flex";
        if (error.response && error.response.data) {
            const errorMessage = error.response.data.message;
            console.log("Backend Error:", errorMessage);
            loginErrorMessage.innerText = JSON.stringify(errorMessage, null, 2);
        }
    }
});