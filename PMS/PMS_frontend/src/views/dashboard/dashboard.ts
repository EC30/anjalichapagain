import "../../css/taskStyle.css";
import axios from "axios";
import renderSidebar from "../../components/sidebar/sidebar";

const sidebar = document.getElementById("sidebar-placeholder") as HTMLElement;
const userNameElement = document.getElementById("userName") as HTMLElement;
const totalProject = document.getElementById("totalProjects");
const completedProject = document.getElementById("completedProjects");
const remainingProject = document.getElementById("RemainingProjects");
const projectTableBody=document.getElementById("projectTableBody");

window.onload = async () => {
    renderSidebar(sidebar);
};

document.addEventListener("DOMContentLoaded", async () => {
    try {
        // const userData = JSON.parse(sessionStorage.getItem("user"));
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
        const response = await axios.get("http://localhost:8000/projects", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        if (userNameElement) {
            userNameElement.textContent = userName;
        }
        const projectData = response.data;
        // console.log(projectData.data);
        // console.log(projectData.data.length);
        if (totalProject) {
            const totalProjectsCount = projectData.data.length;
            totalProject.textContent = totalProjectsCount.toString();
        }

        if (completedProject) {
            const completedProjectsCount = projectData.data.filter(project => project.status === true).length;
            completedProject.textContent = completedProjectsCount.toString();
        }

        if (remainingProject) {
            const remainingProjectsCount = projectData.data.filter(project => project.status === false).length;
            remainingProject.textContent = remainingProjectsCount.toString();
        }

        for (let i = 0; i < projectData.data.length; i++) {
            const projectRow = document.createElement("tr");
            const projectName = document.createElement("td");
            const projectDeadline = document.createElement("td");
            const projectStatus = document.createElement("td");
            const status=document.createElement("span");

            projectName.textContent=projectData.data[i].name;
            projectDeadline.textContent=projectData.data[i].deadline;
            if(projectData.data[i].status===false){
                status.textContent="Pending";
                status.className="statusPending";
            }else{
                status.textContent="Completed"; 
                status.className="statusCompleted";
            }

            projectRow.appendChild(projectName);
            projectRow.appendChild(projectDeadline);
            projectRow.appendChild(projectStatus);
            projectStatus.appendChild(status);
            projectTableBody?.appendChild(projectRow);

        }

    } catch (error) {
        console.error("Error fetching user details or project data:", error);
    }
});

