import "./style.css";

const popup:HTMLElement | null = document.getElementById("myModal");
const taskList_remaining:HTMLElement | null = document.getElementById("taskList_remaining");

document.getElementById("openPopup")?.addEventListener("click",function(){
    if(popup){
        popup.style.display="flex";
    }
});

document.getElementById("closePopup")?.addEventListener("click",function(){
    if(popup){
        popup.style.display="none";
    }
});

document.getElementById("addTask")?.addEventListener("click",function(){
    const taskInput = document.getElementById("addTaskInput") as HTMLInputElement;
    const taskText: string = taskInput.value.trim();
    addTaskFinal(taskText);
    taskInput.value = "";
});
document.getElementById("addTaskPopup")?.addEventListener("click",function(){
    const taskNameInput = document.getElementById("taskName") as HTMLInputElement;
    const taskName: string = taskNameInput.value.trim();
    addTaskFinal(taskName);
    taskNameInput.value = "";
});

document.getElementById("home")?.addEventListener("click",function(){
    show_all();
});

document.getElementById("completed")?.addEventListener("click",function(){
    show_all();
    const elems = document.querySelectorAll("div");
    const divs = Array.from(elems).filter((e: Element) => {
        return e.classList.contains("remaining");
    });
    divs.forEach(myFunction);
});
document.getElementById("remaining")?.addEventListener("click",function(){
    show_all();
    const elems = document.querySelectorAll("div");
    const divs = Array.from(elems).filter((e: Element) => {
        return e.classList.contains("completed");
    });
    divs.forEach(myFunction);

});
const all_tasks: Array<[number, string, number]> = [];
let count: number = 1;
  
  
function addTaskFinal(taskName: string): void {
    if (taskName !== "") {
    // Create a new paragraph element for the task
        all_tasks.push([count, taskName, 0]);
        console.log(all_tasks);
        count++;
        updateTasks();
    } else {
        alert("Please enter a task.");
    }
}
    
function showFunction(myDiv: HTMLElement): void {
    myDiv.style.display = "flex";
}
  
function myFunction(myDiv: HTMLElement): void {
    myDiv.style.display = "none";
}
  
function change_status(list_item: number): void {
    console.log(all_tasks.length);
    if (all_tasks[list_item - 1][all_tasks[list_item - 1].length - 1] == 0) {
        all_tasks[list_item - 1][all_tasks[list_item - 1].length - 1] = 1;
    } else {
        all_tasks[list_item - 1][all_tasks[list_item - 1].length - 1] = 0;
    }
    console.log(all_tasks);
    updateTasks();
}

function show_all(){
    const elems = document.querySelectorAll("div.custom-div") as NodeListOf<HTMLElement>;
    elems.forEach(showFunction);
}  
function updateTasks(): void {
    if (taskList_remaining) {
        taskList_remaining.innerHTML = "";
        for (let i = 0; i < all_tasks.length; i++) {
            const customDiv = document.createElement("div");
            customDiv.className = "custom-div";
            const taskItem = document.createElement("p");
            taskItem.textContent = all_tasks[i][1];
    
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.className = "rounded-checkbox";
  
            if (all_tasks[i][2] == 0) {
                customDiv.classList.add("remaining");
                taskItem.style.textDecoration = "none";
            } else {
                customDiv.classList.add("completed");
                taskItem.style.textDecoration = "line-through";
                checkbox.setAttribute("checked", "true");
            }
            checkbox.addEventListener("click", function() {
                change_status(all_tasks[i][0]);
            });
  
            customDiv.appendChild(taskItem);
            customDiv.appendChild(checkbox);
            taskList_remaining.appendChild(customDiv);
            if (taskList_remaining.style) {
                taskList_remaining.style.display = "block";
            }
        }
    }
}
  
const searchInput = document.getElementById("searchInput") as HTMLInputElement;
const divContainer = document.getElementById("taskList_remaining");
if (searchInput && divContainer) {
    searchInput.addEventListener("input", function (): void {
        const searchQuery: string = searchInput.value.toLowerCase() ;
        const searchableDivs = document.querySelectorAll(".custom-div") as NodeListOf<HTMLElement>;
        searchableDivs.forEach(function (div: HTMLElement): void {
            const paragraphElement = div.querySelector("p");
            if (paragraphElement) {
                const paragraphContent = paragraphElement.textContent?.toLowerCase();
                if (paragraphContent && paragraphContent.includes(searchQuery)) {
                    div.style.display = "flex";
                } else {
                    div.style.display = "none";
                }
            }
        });
    });
}
  
