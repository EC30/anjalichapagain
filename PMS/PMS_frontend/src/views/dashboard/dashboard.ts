import "../../css/taskStyle.css";
import axios from "axios";
import renderSidebar from "../../components/sidebar/sidebar";
const sidebar=document.getElementById("sidebar-placeholder") as HTMLElement;
window.onload = async () => {
    renderSidebar(sidebar, "sidebar-dashboard");
};
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await axios.get("http://localhost:8000/users", {
            headers: {
                "Authorization": "Bearer YOUR_ACCESS_TOKEN",
            },
        });

        const userData = response.data;
        const userNameElement = document.getElementById("userName");
        
        if (userNameElement) {
            userNameElement.textContent = userData.fullname; 
        }
    } catch (error) {
        console.error("Error fetching user details:", error);
    }
});
