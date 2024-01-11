import "../../css/taskStyle.css";
import axios from "axios";
import renderSidebar from "../../components/sidebar/sidebar";

const sidebar = document.getElementById("sidebar-placeholder") as HTMLElement;
const cardFlexContainer = document.getElementById("cardFlex");

function toggleStatus(event) {
    const checkbox = event.target;
    const card = checkbox.closest(".card");
    const statusText = card.querySelector(".status-text");

    if (checkbox.checked) {
        statusText.textContent = "Completed";
        checkbox.style.backgroundColor = "green";
    } else {
        statusText.textContent = "Pending";
        checkbox.style.backgroundColor = "red";
    }
}


window.onload = async () => {
    renderSidebar(sidebar, "sidebar-dashboard");
};

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const userData = JSON.parse(sessionStorage.getItem("user"));
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            console.error("No access token found");
            return;
        }
        const response = await axios.get("http://localhost:8000/projects/assigned", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const assignedData = response.data;
        console.log(assignedData.data[0].projectName);

        for( let i=0; i< assignedData.data.length; i++){
            const card = document.createElement("div");
            card.className="card";
            const img = document.createElement("img");
            // img.src = assignedData.data[i].imageUrl;
            img.src = "../../images/aa.jpg";
            const cardContent = document.createElement("div");
            cardContent.className = "card-content";
            const projectName = document.createElement("div");
            projectName.className = "project-name";
            const projectDescription = document.createElement("div");
            projectDescription.className = "project-description";
            const deadline = document.createElement("div");
            deadline.className = "deadline";
            const priority = document.createElement("div");
            priority.className = "deadline";
            const completionStatus = document.createElement("div");
            completionStatus.className = "completion-status";
            const statusText = document.createElement("div");
            statusText.className = "status-text";
            const toggleMode = document.createElement("input");
            toggleMode.type = "checkbox";
            toggleMode.id = "toggle-mode";
            toggleMode.addEventListener("change", toggleStatus);

            img.addEventListener("click", () => {
                const popup = document.createElement("div");
                popup.className = "popup";
                const popupImg = document.createElement("img");
                popupImg.src = "../../images/aa.jpg";
                popup.appendChild(popupImg);
                
                popup.addEventListener("click", () => {
                    document.body.removeChild(popup);
                });

                document.body.appendChild(popup);
            });

            projectName.textContent=assignedData.data[i].projectName;
            projectDescription.textContent=assignedData.data[0].projectDesc;
            deadline.textContent=assignedData.data[i].deadline;
            priority.textContent="High Priority";
            if(assignedData.data[i].projectStatus===false){
                statusText.textContent="Pending";
                toggleMode.style.backgroundColor="red";
            }else{
                statusText.textContent="Completed"; 
                toggleMode.style.backgroundColor="green";
            }
            cardContent.appendChild(projectName);
            cardContent.appendChild(projectDescription);
            cardContent.appendChild(deadline);
            cardContent.appendChild(priority);
            cardContent.appendChild(completionStatus);
            completionStatus.appendChild(statusText);
            completionStatus.appendChild(toggleMode);
            card?.appendChild(img);
            card?.appendChild(cardContent);
            cardFlexContainer?.appendChild(card);


        }
    
    } catch (error) {
        console.error("Error fetching assigned projects:", error);
    }
});