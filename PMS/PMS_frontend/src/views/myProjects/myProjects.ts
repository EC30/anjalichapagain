import "../../css/taskStyle.css";
import axios from "axios";
import formattedDate from "../../components/sidebar/render";
const cardFlexContainer = document.getElementById("cardFlex");
const baseurl="http://localhost:8000/";
const queryParams=window.location.search;

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            console.error("No access token found");
            return;
        }
        const response = await axios.get(`http://localhost:8000/projects/assigned${queryParams}`, {
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
            const completionDeadline = formattedDate(new Date(assignedData.data[i].deadline));
            const today = formattedDate(new Date());
            
            if (completionDeadline == today && assignedData.data[i].projectStatus === false) {
                const alertText = document.createElement("div");
                alertText.textContent = "Last day to complete project!";
                alertText.style.color = "Orange"; 
                
                card.style.backgroundColor = "#FFE0D3";

                cardContent.appendChild(alertText);
            }
            if (completionDeadline < today && assignedData.data[i].projectStatus === false) {
                const alertText = document.createElement("div");
                alertText.textContent = "Project has passed the completion deadline and is still pending!";
                alertText.style.color = "red"; 
                
                card.style.backgroundColor = "#FFE0D3";

                cardContent.appendChild(alertText);
            }

            const statusText = document.createElement("div");
            statusText.className = "status-text";
            const toggleMode = document.createElement("input");
            toggleMode.type = "checkbox";
            toggleMode.id = "toggle-mode";
            toggleMode.dataset.projectId = assignedData.data[i].projectId; 
            // toggleMode.addEventListener("change", toggleStatus.bind(null, assignedData, i));
            toggleMode.addEventListener("change", handleToggleStatus);
            

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
            deadline.textContent=formattedDate(new Date(assignedData.data[i].deadline));
            priority.textContent=assignedData.data[i].priority;
            if(assignedData.data[i].projectStatus===false){
                statusText.textContent="Pending";
                toggleMode.style.backgroundColor="red";
            }else{
                statusText.textContent="Completed"; 
                card.style.backgroundColor="#D0F0C0";
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

async function toggleStatus(checkbox:HTMLInputElement,projectId:number) {
    const card = checkbox.closest(".card") as HTMLElement;
    const statusText = card?.querySelector(".status-text") as HTMLElement;

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
            card.style.backgroundColor="#D0F0C0";
        } else {
            statusText.textContent = "Pending";
            checkbox.style.backgroundColor = "red";
            card.style.backgroundColor="#FFFFE0";
        }
    } catch (error) {
        console.error("Error updating the project status:", error);
    }
}

async function handleToggleStatus(event: Event) {
    const checkbox = event.target as HTMLInputElement; //which triggered the event
    const projectId = checkbox.dataset.projectId; 

    if (projectId) {
        await toggleStatus(checkbox,parseInt(projectId));
    } else {
        console.error("Project ID not found.");
    }
}