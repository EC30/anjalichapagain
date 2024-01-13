// render.ts

import "../../css/taskStyle.css";
import renderSidebar from "../sidebar/sidebar";
import renderNavbar from "../sidebar/navbar";
import axios from "axios";

const sidebar = document.getElementById("sidebar-placeholder") as HTMLElement;
const navbar = document.getElementById("navbar-placeholder") as HTMLElement;

document.addEventListener("DOMContentLoaded", async () => {
    await renderSidebar(sidebar);
    await renderNavbar(navbar);

    const menuBar = document.getElementById("toggle-button");
    const sidebars = document.getElementById("sidebar");

    menuBar?.addEventListener("click", function () {
        sidebars?.classList.toggle("hide");
    });

    try {
        const userNameElement = document.getElementById("userName") as HTMLElement;
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            console.error("No access token found");
            return;
        }

        const userData = await axios.get("http://localhost:8000/users/check", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const userName = userData.data.data.fullname;
        if (userNameElement) {
            userNameElement.textContent = userName;
        }

    } catch (error) {
        console.error("Error fetching user details or project data:", error);
    }
});





// document.addEventListener("DOMContentLoaded", async () => {
//     try {
//         const userNameElement = document.getElementById("userName") as HTMLElement;
//         console.log(userNameElement);
//         const accessToken = localStorage.getItem("accessToken");

//         if (!accessToken) {
//             console.error("No access token found");
//             return;
//         }
//         const userData = await axios.get("http://localhost:8000/users/check", {
//             headers: {
//                 Authorization: `Bearer ${accessToken}`,
//             },
//         });

//         const userName = userData.data.data.fullname;
//         if (userNameElement) {
//             userNameElement.textContent = userName;
//         }
//         console.log(userName);

//     } catch (error) {
//         console.error("Error fetching user details or project data:", error);
//     }
// });
