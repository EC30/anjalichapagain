import axios from "axios";
import * as yup from "yup";

const signUpUsername = document.getElementById("signup-username") as HTMLInputElement;
const signUpFullname = document.getElementById("signup-fullname") as HTMLInputElement;
const signUpEmail = document.getElementById("signup-email") as HTMLInputElement;
const signUpPassword = document.getElementById("signup-password") as HTMLInputElement;
const signUpCPassword = document.getElementById("signup-confirm-password") as HTMLInputElement;
const signUpButton = document.getElementById("signup") as HTMLButtonElement;
const errorMessage=document.getElementById("signup-error-meesage") as HTMLDivElement;
const successMessage = document.getElementById("successMessage") as HTMLDivElement;

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
    console.log(errorMessage);

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
        successMessage.style.display = "block";  
        setTimeout(() => {
            successMessage.style.display = "none";  
        }, 3000);
        window.location.href="../../../index.html";
    } catch (error) {
        errorMessage.style.display = "flex";
        if (error.response && error.response.data) {
            const backendErrors = error.response.data.message;
            console.log("Backend Errors:", backendErrors);
            errorMessage.innerText = JSON.stringify(backendErrors, null, 2);
        } else {
            console.log(error.errors);
            errorMessage.innerText = error.errors.join("\n");
        }
    }
});