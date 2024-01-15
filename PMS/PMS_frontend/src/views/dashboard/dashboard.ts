import "../../css/taskStyle.css";
import axios from "axios";

const totalProject = document.getElementById("totalProjects");
const completedProject = document.getElementById("completedProjects");
const remainingProject = document.getElementById("RemainingProjects");
const projectTableBody=document.getElementById("projectTableBody");
const queryParams=window.location.search;

function formattedDate(date:Date){
    return [ 
        date.getFullYear(),
        date.getMonth()+1,
        date.getDate(),
    ].join("-");

}
export interface Iprojects {
    name: string;
    description:string;
    deadline:Date;
    image:string;
    assigned_by: number;
    priority: "High" | "Medium" | "Low";
    status?: boolean;
  }


document.addEventListener("DOMContentLoaded", async () => {
    try {

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
        const projectData = response.data;
        console.log(projectData);
        if (totalProject) {
            const totalProjectsCount = projectData.data.length;
            totalProject.textContent = totalProjectsCount.toString();
        }

        if (completedProject) {
            const completedProjectsCount = projectData.data.filter((project:Iprojects) => project.status === true).length;
            completedProject.textContent = completedProjectsCount.toString();
        }

        if (remainingProject) {
            const remainingProjectsCount = projectData.data.filter((project:Iprojects) => project.status === false).length;
            remainingProject.textContent = remainingProjectsCount.toString();
        }

        for (let i = 0; i < projectData.data.length; i++) {
            const projectRow = document.createElement("tr");
            const projectName = document.createElement("td");
            const projectDeadline = document.createElement("td");
            const projectStatus = document.createElement("td");
            const projectPriority = document.createElement("td");
            const status=document.createElement("span");

            projectName.textContent=projectData.data[i].name;
            // projectDeadline.textContent=new Date(projectData.data[i].deadline).toLocaleString("en-US",{ timeZone: "Asia/Kathmandu" });
            projectDeadline.textContent=formattedDate(new Date(projectData.data[i].deadline));
            projectPriority.textContent=projectData.data[i].priority;
            if(projectData.data[i].status===false){
                status.textContent="Pending";
                status.className="statusPending";
            }else{
                status.textContent="Completed"; 
                status.className="statusCompleted";
            }
            if(projectData.data[i].priority==="High"){
                projectPriority.style.color="green";
                projectPriority.style.fontWeight="bold";
            }

            projectRow.appendChild(projectName);
            projectRow.appendChild(projectDeadline);
            projectRow.appendChild(projectStatus);
            projectStatus.appendChild(status);
            projectRow.appendChild(projectPriority);
            projectTableBody?.appendChild(projectRow);
            console.log(new Date(projectData.data[i].deadline).toLocaleString("en-US",{ timeZone: "Asia/Kathmandu" }));

        }

    } catch (error) {
        console.error("Error fetching user details or project data:", error);
    }
});

