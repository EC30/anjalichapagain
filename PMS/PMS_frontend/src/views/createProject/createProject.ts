import axios from "axios";
import * as yup from "yup";

const projectName = document.getElementById("projectName") as HTMLInputElement;
const projectDesc = document.getElementById("projectDescription") as HTMLInputElement;
const projectDeadline = document.getElementById("deadline") as HTMLInputElement;
const submitButton = document.getElementById("submitButton") as HTMLButtonElement;
const image=document.getElementById("image") as HTMLInputElement;
const errorMessage=document.getElementById("project-error-message") as HTMLDivElement;
const dropdownMenu = document.querySelector("#userDropdown .dropdown-menu");
const selectedUsersDiv = document.getElementById("selectedUsers") as HTMLDivElement;

const validationSchema = yup.object().shape({
    name: yup.string().required().min(4),
    description: yup.string().required().min(10),
    deadline: yup.date().required(),
});

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
function resetForm() {
    projectName.value = "";
    projectDesc.value = "";
    projectDeadline.value = "";
    image.value = ""; // Reset the file input if applicable

    const checkboxes = dropdownMenu?.querySelectorAll(".form-check-input");
    checkboxes?.forEach((checkbox) => {
        (checkbox as HTMLInputElement).checked = false;
    });

    selectedUsersDiv.innerHTML = "";

    errorMessage.style.display = "none";
}

document.addEventListener("DOMContentLoaded", async () => {
    const projectPriority=document.getElementById("priority") as HTMLSelectElement;
    if (dropdownMenu && selectedUsersDiv) {
        dropdownMenu.addEventListener("change", () => {
            updateSelectedUsers(dropdownMenu, selectedUsersDiv);
        });
    }

    try {
        const response = await axios.get("http://localhost:8000/users");
        const userData = response.data;
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

            const label = document.createElement("label");
            label.classList.add("form-check-label");
            label.htmlFor = userData.data[i].id;
            label.textContent = userData.data[i].fullname;

            formCheck.appendChild(checkbox);
            formCheck.appendChild(label);

            dropdownMenu?.appendChild(formCheck);
            // console.log(user);
        }
        submitButton.addEventListener("click", async (event) => {
            event.preventDefault();
            const name = projectName.value;
            const description = projectDesc.value;
            const deadline = projectDeadline.value;
            const selectedValue = projectPriority.value;
            console.log(selectedValue);
            const selectedUsers: string[] = [];
            const imageupload = image?.files?.[0] ?? null;
            
            const checkboxes = dropdownMenu?.querySelectorAll(".form-check-input");
            checkboxes?.forEach((checkbox) => {
                if ((checkbox as HTMLInputElement).checked) {
                    selectedUsers.push((checkbox as HTMLInputElement).id);
                }
            });
            try {
                const accessToken = localStorage.getItem("accessToken");
                
                if (!accessToken) {
                    console.error("No access token found");
                    return;
                }
                await validationSchema.validate({
                    name: projectName.value,
                    description:projectDesc.value,
                    deadline: projectDeadline.value,
                }, { abortEarly: false });
                if (selectedUsers.length === 0) {
                    errorMessage.style.display = "flex";
                    errorMessage.innerText = "Please select at least one user.";
                    return;
                }
                const formData=new FormData();
                if(imageupload){
                    formData.append("image",imageupload);
                }
                formData.append("name", name);
                formData.append("description", description);
                formData.append("deadline", deadline);
                formData.append("priority", selectedValue);
                
                const projectResponse = await axios.post("http://localhost:8000/projects", 
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    });
                
                console.log("Project created response:", projectResponse);
                console.log("Project message response:", projectResponse.data.message);
                console.log("Project id:", projectResponse.data.projectInfo.projectData[0].id);

                // Check if projectResponse.data.id exists
                if (projectResponse.data && projectResponse.data.projectInfo.projectData[0].id) {
                    const projectId: number = projectResponse.data.projectInfo.projectData[0].id;
                
                    // Post assigned user data
                    const assignedUserResponse = await axios.post(`http://localhost:8000/projects/${projectId}/assign`, {
                        assigned_to: selectedUsers,
                    }, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    });
                
                    console.log("Assigned users response:", assignedUserResponse);
                
                } else {
                    console.error("Project ID not found in the response:", projectResponse);
                }
                resetForm();
                
            } catch (error: unknown) {
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
