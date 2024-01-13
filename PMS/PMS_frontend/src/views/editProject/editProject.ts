import axios from "axios";

const projectName = document.getElementById("projectName") as HTMLInputElement;
const projectDesc = document.getElementById("projectDescription") as HTMLInputElement;
const projectDeadline = document.getElementById("deadline") as HTMLInputElement;
const editButton = document.getElementById("editButton") as HTMLButtonElement;
const projectPriority=document.getElementById("priority") as HTMLSelectElement;
const image=document.getElementById("imageShow") as HTMLInputElement;
const imageInput = document.getElementById("image") as HTMLInputElement;
const errorMessage=document.getElementById("edit-error-message") as HTMLDivElement;
const baseurl="http://localhost:8000/";

function updateSelectedUsers(dropdownMenu: Element , selectedUsersDiv: HTMLElement): void {
    if (dropdownMenu && selectedUsersDiv) {
        const selectedUsers: string[] = [];
        const checkboxes = dropdownMenu.querySelectorAll(".form-check-input");

        checkboxes.forEach((checkbox) => {
            if ((checkbox as HTMLInputElement).checked) {
                selectedUsers.push((checkbox as HTMLInputElement).value);
            }
        });
        selectedUsersDiv .innerHTML = `<b>Selected Users:</b> ${selectedUsers.join(", ")}`;
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get("id");
    const accessToken = localStorage.getItem("accessToken");
    const projectDetailsResponse = await axios.get(`http://localhost:8000/projects/${projectId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    const assignedUSers = await axios.get(`http://localhost:8000/projects/assignedUsers/${projectId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    const projectDetails = projectDetailsResponse.data; 
    projectName.value = projectDetails.name || "";
    projectDesc.value = projectDetails.description || "";
    projectDeadline.value = projectDetails.deadline || "";
    projectPriority.value = projectDetails.priority;

    if(projectDetails.image){
        const aa = projectDetails.image.replace(/\\/g, "/");
        const imageUrl = `${baseurl}${aa}`;
        image.src = imageUrl;
    }
    else{
        image.src = `${baseurl}src/uploads/default.jpg`;
    }
    imageInput.addEventListener("change", (event) => {
        const selectedImage = (event.target as HTMLInputElement).files?.[0];
        if (selectedImage) {
            const imageUrl = URL.createObjectURL(selectedImage);
            image.innerHTML = `<img src="${imageUrl}" alt="Selected Image" />`;
        } else {
            image.innerHTML = "";
        }
    });
    const dropdownMenu = document.querySelector("#userDropdown .dropdown-menu");
    const selectedUsersDiv = document.getElementById("selectedUsers");
    

    if (dropdownMenu && selectedUsersDiv) {
        dropdownMenu.addEventListener("change", () => {
            updateSelectedUsers(dropdownMenu, selectedUsersDiv);
        });
    }

    try {
        const response = await axios.get("http://localhost:8000/users");
        const userData = response.data;
        const selectedUsers:Array<number>=[];
        const accessToken = localStorage.getItem("accessToken");
                
        if (!accessToken) {
            console.error("No access token found");
            return;
        }
        const userCheck = await axios.get("http://localhost:8000/users/check", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        for (let i = 0; i < userData.data.length; i++) {
            if(userCheck.data.data.id == userData.data[i].id){
                continue;
            }
            const formCheck = document.createElement("div");
            formCheck.classList.add("form-check");

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.classList.add("form-check-input");
            checkbox.id = userData.data[i].id;
            checkbox.value = userData.data[i].fullname;
            if(assignedUSers.data.data.includes(parseInt(userData.data[i].id))){
                checkbox.checked=true;
                selectedUsers.push(userData.data[i].fullname);
                
            }
            const label = document.createElement("label");
            label.classList.add("form-check-label");
            label.htmlFor = userData.data[i].id;
            label.textContent = userData.data[i].fullname;

            formCheck.appendChild(checkbox);
            formCheck.appendChild(label);

            dropdownMenu?.appendChild(formCheck);
        }
        if(selectedUsersDiv){
            selectedUsersDiv.innerHTML = `<b>Selected Users:</b> ${selectedUsers.join(", ")}`;
        }

       
        editButton.addEventListener("click", async (event) => {
            event.preventDefault();
            const name = projectName.value;
            const description = projectDesc.value;
            const deadline = projectDeadline.value;
            const selectedUsers: number[] = [];
            const selectedValue = projectPriority.value;
            const imageupload = imageInput?.files?.[0] ?? null;
        
            const checkboxes = dropdownMenu?.querySelectorAll(".form-check-input");
            checkboxes?.forEach((checkbox) => {
                if ((checkbox as HTMLInputElement).checked) {
                    selectedUsers.push(parseInt((checkbox as HTMLInputElement).id));
                }
            });
            console.log(selectedUsers);
        
            // let formData = new FormData(document.querySelector("form"));
            const formData=new FormData();
            formData.append("name", name);
            formData.append("description", description);
            formData.append("deadline", deadline);
            formData.append("priority", selectedValue);
            if(imageupload){
                formData.append("image",imageupload);
            }
        
        
            try {
                const accessToken = localStorage.getItem("accessToken");
        
                if (!accessToken) {
                    console.error("No access token found");
                    return;
                }
        
                const projectResponse = await axios.put(
                    `http://localhost:8000/projects/${projectId}`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            
                        },
                    }
                );
        
                console.log("Project edited response:", projectResponse);
                console.log("Project message response:", projectResponse.data.message);
        
                console.log(selectedUsers[0]);
                console.log(typeof selectedUsers[0]);
                const assignedUserResponse = await axios.post(
                    `http://localhost:8000/projects/${projectId}/assign`,
                    {
                        assigned_to: selectedUsers,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
        
                console.log("Assigned users response:", assignedUserResponse);
                
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
        
    } catch (error) {
        console.error("Error fetching assigned projects:", error);
    }
});
