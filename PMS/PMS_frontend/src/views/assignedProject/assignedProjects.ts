import "../../css/taskStyle.css";
import axios from "axios";
import renderSidebar from "../../components/sidebar/sidebar";
const sidebar = document.getElementById("sidebar-placeholder") as HTMLElement;
const cardFlexContainer = document.getElementById("cardFlex");
// const editPopup=document.getElementById("editPopup");
// const projectName = document.getElementById("projectName") as HTMLInputElement;
// const projectDesc = document.getElementById("projectDescription") as HTMLInputElement;
// const projectDeadline = document.getElementById("deadline") as HTMLInputElement;
// const submitButton = document.getElementById("submitButton") as HTMLButtonElement;
// const image=document.getElementById("image") as HTMLInputElement;

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
window.onload = async () => {
    renderSidebar(sidebar, "sidebar-dashboard");
};
function confirmDelete() {
    if (confirm("Are you sure you want to delete this project?")) {
        deleteProject();
    }
}
function deleteProject() {
    alert("Project deleted successfully."); 
}
function editProject() {
    //editPopup.style.display = "flex";
    window.location.href="../editProject/editProject.html";
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
        // const userData = JSON.parse(sessionStorage.getItem("user"));
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            console.error("No access token found");
            return;
        }
        const response = await axios.get("http://localhost:8000/projects", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const assignedData = response.data;

        for( let i=0; i< assignedData.data.length; i++){
            const card = document.createElement("div");
            card.className="card";
            const img = document.createElement("img");
            img.src = assignedData.data[i].image;
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
                popupImg.src = assignedData.data[i].image;
                popup.appendChild(popupImg);
                
                popup.addEventListener("click", () => {
                    document.body.removeChild(popup);
                });

                document.body.appendChild(popup);
            });

            projectName.textContent=assignedData.data[i].name;
            projectDescription.textContent=assignedData.data[0].description;
            deadline.textContent=assignedData.data[i].deadline;
            priority.textContent="High Priority";
            if(assignedData.data[i].status===false){
                statusText.textContent="Pending";
                toggleMode.style.backgroundColor="red";
            }else{
                statusText.textContent="Completed"; 
                toggleMode.style.backgroundColor="green";
            }
            const actionButtons = document.createElement("div");
            actionButtons.className = "action-buttons";
            
            const editButton = document.createElement("i");
            editButton.className = "fas fa-edit";
            // const link =document.createElement("a");
            editButton.addEventListener("click", editProject);
        
            const deleteButton = document.createElement("i");
            deleteButton.className = "fas fa-trash";
            deleteButton.addEventListener("click", confirmDelete);
        
            // link.appendChild(editButton);
            // link.href="../editProject/editProject.html";
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
