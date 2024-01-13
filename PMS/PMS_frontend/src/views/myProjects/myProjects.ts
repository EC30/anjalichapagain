import "../../css/taskStyle.css";
import axios from "axios";
const cardFlexContainer = document.getElementById("cardFlex");
const baseurl="http://localhost:8000/";

document.addEventListener("DOMContentLoaded", async () => {
    try {
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
            if(assignedData.data[i].image){
                const aa = assignedData.data[i].image.replace(/\\/g, "/");
                img.src = `${baseurl}${aa}`;
                console.log(aa);
            }else{
                img.src = `${baseurl}src/uploads/default.jpg`;
            } 
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
            toggleMode.dataset.projectId = assignedData.data[i].projectId; 
            toggleMode.addEventListener("change", toggleStatus.bind(null, assignedData, i));
            

            img.addEventListener("click", () => {
                const popup = document.createElement("div");
                popup.className = "popup";
                const popupImg = document.createElement("img");
                popupImg.src = img.src;
                
                popup.appendChild(popupImg);              
                popup.addEventListener("click", () => {
                    document.body.removeChild(popup);
                });

                document.body.appendChild(popup);
            });

            projectName.textContent=assignedData.data[i].projectName;
            projectDescription.textContent=assignedData.data[0].projectDesc;
            deadline.textContent=assignedData.data[i].deadline;
            priority.textContent=assignedData.data[i].priority;
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

async function toggleStatus(assignedData, index:number, event) {
    const checkbox = event.target;
    const card = checkbox.closest(".card");
    const statusText = card.querySelector(".status-text");
    const projectId = assignedData.data[index].projectId;

    try {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            console.error("No access token found");
            return;
        }

        const updateResponse = await axios.put(`http://localhost:8000/projects/assigned/${projectId}`, {
            status: checkbox.checked,
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        console.log("Project status updated successfully.", updateResponse);

        if (checkbox.checked) {
            statusText.textContent = "Completed";
            checkbox.style.backgroundColor = "green";
        } else {
            statusText.textContent = "Pending";
            checkbox.style.backgroundColor = "red";
        }
    } catch (error) {
        console.error("Error updating the project status:", error);
    }
}