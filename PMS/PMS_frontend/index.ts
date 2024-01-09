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
import * as yup from "yup";

const signUpUsername = document.getElementById("signup-username") as HTMLInputElement;
const signUpFullname = document.getElementById("signup-fullname") as HTMLInputElement;
const signUpEmail = document.getElementById("signup-email") as HTMLInputElement;
const signUpPassword = document.getElementById("signup-password") as HTMLInputElement;
const signUpCPassword = document.getElementById("signup-confirm-password") as HTMLInputElement;
const signUpButton = document.getElementById("signup") as HTMLButtonElement;
const errorMessage=document.getElementById("error-message");

const schema = yup.object().shape({
    username: yup.string().required().min(6).label("Username"),
    fullname: yup.string().required().matches(/^\S+ \S+$/, "Fullname should consist of first and last name separated by a space").label("Fullname"),
    email: yup.string().required().email().label("Email"),
    password: yup.string().required().min(8)
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};:'",.<>/?]).{8,}$/, "Password should be a combination of uppercase letters, lowercase letters, at least one special character, and at least one number")
        .label("Password"),
    confirmPassword: yup.string().required().oneOf([yup.ref("password")], "Passwords must match").label("Confirm Password"),
});

signUpButton.addEventListener("click", async (event) => {
    event.preventDefault();

    if (signUpPassword.value !== signUpCPassword.value) {
        alert("Password and Confirm Password do not match");
        return;
    }
    try {
        await schema.validate({
            username: signUpUsername.value,
            fullname: signUpFullname.value,
            email: signUpEmail.value,
            password: signUpPassword.value,
            confirmPassword: signUpCPassword.value,
        }, { abortEarly: false });

        const response = await axios.post("http://localhost:8000/auth/signup", {
            username: signUpUsername.value,
            fullname: signUpFullname.value,
            email: signUpEmail.value,
            password: signUpPassword.value,
        });

        console.log(response);
    } catch (error) {
        console.log(error.errors);
        alert(error.errors.join("\n"));
    }
});


const signInUsername = document.getElementById("signin-username") as HTMLInputElement;
const signInPassword = document.getElementById("signin-password") as HTMLInputElement;
const loginButton = document.getElementById("login") as HTMLButtonElement;

loginButton.addEventListener("click", async (event) => {
    event.preventDefault();
    try{
        const username=signInUsername.value;
        const password=signInPassword.value;
        const response = await axios.post("http://localhost:8000/auth/login", {
            username,
            password,
        });
        const { token } = response.data;
        console.log("Login successful");
        console.log("Token:", token);
    }catch(error){
        console.log("Login failed");
        console.error(error);
    }
});