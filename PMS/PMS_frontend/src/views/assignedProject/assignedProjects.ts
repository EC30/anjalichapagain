import "../../css/taskStyle.css";
import axios from "axios";
const cardFlexContainer = document.getElementById("cardFlex");
const baseurl="http://localhost:8000/";
const queryParams=window.location.search;

function updateSelectedUsers(dropdownMenu: Element | null, selectedUsersDiv: HTMLElement | null): void {
    if (dropdownMenu && selectedUsersDiv) {
        const selectedUsers: string[] = [];
        const checkboxes = dropdownMenu.querySelectorAll(".form-check-input");

        checkboxes.forEach((checkbox) => {
            if ((checkbox as HTMLInputElement).checked) {
                selectedUsers.push((checkbox as HTMLInputElement).value);
            }
        });

        console.log(selectedUsers);
        selectedUsersDiv.innerHTML = `<b>Selected Users:</b> ${selectedUsers.join(", ")}`;
    }
}

function confirmDelete(projectId:number) {
    if (confirm("Are you sure you want to delete this project?")) {
        deleteProject(projectId);
    }
}
async function deleteProject(projectId:number) {
    try {
        const accessToken = localStorage.getItem("accessToken");
        
        if (!accessToken) {
            console.error("No access token found");
            return;
        }

        // Send a DELETE request to delete the project
        const deleteResponse = await axios.delete(`http://localhost:8000/projects/${projectId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        alert("project deleted successfully");
        console.log("Project deleted successfully.", deleteResponse);

        // Optionally, you can remove the deleted project from the UI
        const cardToRemove = document.querySelector(`.card[data-project-id="${projectId}"]`);
        if (cardToRemove) {
            cardFlexContainer?.removeChild(cardToRemove);
        }
    } catch (error) {
        console.error("Error deleting the project:", error);
    }
}
function editProject(projectId:number) {
    window.location.href=`../editProject/editProject.html?id=${projectId}`;
}
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const dropdownMenu = document.querySelector("#userDropdown .dropdown-menu");
        const selectedUsersDiv = document.getElementById("selectedUsers");
    
        if (dropdownMenu && selectedUsersDiv) {
            dropdownMenu.addEventListener("change", () => {
                updateSelectedUsers(dropdownMenu, selectedUsersDiv);
            });
        }
        const userResponse = await axios.get("http://localhost:8000/users");
        const userResponseData = userResponse.data;
        console.log(userResponseData.data);

        for (let i = 0; i < userResponseData.data.length; i++) {
            const formCheck = document.createElement("div");
            formCheck.classList.add("form-check");

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.classList.add("form-check-input");
            checkbox.id = userResponseData.data[i].id;
            checkbox.value = userResponseData.data[i].fullname;

            const label = document.createElement("label");
            label.classList.add("form-check-label");
            label.htmlFor = userResponseData.data[i].id;
            label.textContent = userResponseData.data[i].fullname;

            formCheck.appendChild(checkbox);
            formCheck.appendChild(label);

            dropdownMenu?.appendChild(formCheck);
            // console.log(user);
        }
      
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            console.error("No access token found");
            return;
        }
        const response = await axios.get(`http://localhost:8000/projects${queryParams}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const assignedData = response.data;

        for( let i=0; i< assignedData.data.length; i++){
            const card = document.createElement("div");
            card.className="card";
            const img = document.createElement("img");
            if(assignedData.data[i].image){
                const aa = assignedData.data[i].image.replace(/\\/g, "/");
                img.src = `${baseurl}${aa}`;
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
            img.addEventListener("click", () => {
                const popup = document.createElement("div");
                popup.className = "popup";
                const popupImg = document.createElement("img");
                popupImg.src=img.src;
                popup.appendChild(popupImg);
                
                popup.addEventListener("click", () => {
                    document.body.removeChild(popup);
                });

                document.body.appendChild(popup);
            });

            const completionDeadline = new Date(assignedData.data[i].deadline);
            console.log(completionDeadline);
            const today = new Date();
            console.log(today);
            
            if (completionDeadline < today && assignedData.data[i].status === false) {
                const alertText = document.createElement("div");
                alertText.textContent = "Project has passed the completion deadline and is still pending!";
                alertText.style.color = "red"; 
                card.style.backgroundColor = "#FFE0D3";

                cardContent.appendChild(alertText);
            }

            const projectId:number=assignedData.data[i].id;
            console.log(projectId);
            toggleMode.dataset.projectId = assignedData.data[i].id; 
            toggleMode.addEventListener("change", toggleStatus.bind(null, assignedData, i));
            projectName.textContent=assignedData.data[i].name;
            projectDescription.textContent=assignedData.data[0].description;
            deadline.textContent=assignedData.data[i].deadline;
            priority.textContent=assignedData.data[i].priority;
            if(assignedData.data[i].status===false){
                statusText.textContent="Pending";
                toggleMode.style.backgroundColor="red";
            }else{
                statusText.textContent="Completed"; 
                toggleMode.style.backgroundColor="green";
                card.style.backgroundColor="#D0F0C0";
            }
            const actionButtons = document.createElement("div");
            actionButtons.className = "action-buttons";
            
            const editButton = document.createElement("i");
            editButton.className = "fas fa-edit";
            editButton.addEventListener("click", () => {
                editProject(projectId);
            });
        
            const deleteButton = document.createElement("i");
            deleteButton.className = "fas fa-trash";
            deleteButton.addEventListener("click", () => {
                confirmDelete(projectId);
            });
        
            actionButtons.appendChild(editButton);
            actionButtons.appendChild(deleteButton);
            cardContent.appendChild(projectName);
            cardContent.appendChild(projectDescription);
            cardContent.appendChild(deadline);
            cardContent.appendChild(priority);
            cardContent.appendChild(completionStatus);
            completionStatus.appendChild(statusText);
            completionStatus.appendChild(toggleMode);
            cardContent.appendChild(actionButtons);
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
    const projectId = assignedData.data[index].id;

    try {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            console.error("No access token found");
            return;
        }

        const updateResponse = await axios.put(`http://localhost:8000/projects/${projectId}`, {
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
