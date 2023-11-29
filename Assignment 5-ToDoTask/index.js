function openModal() {
  var modal = document.getElementById("myModal");
  modal.style.display = "block";
}

function closeModal() {
  var modal = document.getElementById("myModal");
  modal.style.display = "none";
}

let all_tasks= [];
	let count=1;
  function addTask() {
    var taskInput = document.getElementById("addTaskInput");
    var taskText = taskInput.value.trim();
    addTaskFinal(taskText);
    taskInput.value = "";
  }
  function addTaskPopup() {
    var taskName = document.getElementById("taskName").value.trim();
    addTaskFinal(taskName);
    document.getElementById("taskName").value = "";
  }

  function addTaskFinal(taskName){
    if (taskName !== "") {
      // Create a new paragraph element for the task
      all_tasks.push([count,taskName,0]);
      console.log(all_tasks);
		  count++;
      
		  updateTasks();
    } else {
      alert("Please enter a task.");
    }
  }

function show_completed(){
  show_all();
  const elems = document.querySelectorAll('div');
  const divs = [...elems].filter(e => {
    return e.classList.contains('remaining');
  });

  divs.forEach(myFunction);
}

function show_remaining(){
	show_all();
	const elems = document.querySelectorAll('div');
  const divs = [...elems].filter(e => {
  return e.classList.contains('completed');
});

divs.forEach(myFunction);
}

function show_all(){
	const elems = document.querySelectorAll('div.custom-div');
	elems.forEach(showFunction);
}

function showFunction(myDiv, index) {
  myDiv.style.display = "flex";
}

function myFunction(myDiv, index) {
  myDiv.style.display = "none";
}

function change_status(list_item){
//alert(list_item-1);
console.log(all_tasks.length);
		if(all_tasks[list_item-1][all_tasks[list_item-1].length-1] == 0){
			all_tasks[list_item-1][all_tasks[list_item-1].length-1] = 1;
		}else{
			all_tasks[list_item-1][all_tasks[list_item-1].length-1] = 0;
		}
		console.log(all_tasks);
		//all_tasks[list_item-1][2] = !all_tasks[list_item][2];
		updateTasks();
}

function updateTasks() {
    var taskList_remaining = document.getElementById("taskList_remaining");
    var noTaskMessage = document.getElementById("noTaskMessage");

  taskList_remaining.innerHTML = '';
	for (let i = 0; i < all_tasks.length; i++) {
		var customDiv = document.createElement('div');
    customDiv.className = 'custom-div';
 		var taskItem = document.createElement("p");
    taskItem.textContent = all_tasks[i][1];

		var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'rounded-checkbox';

		if(all_tasks[i][2] == 0){
			customDiv.classList.add('remaining');
			taskItem.style.textDecoration = 'none';
		}else{

			customDiv.classList.add('completed');
			taskItem.style.textDecoration = 'line-through';
			checkbox.setAttribute('checked','true');
		}
		

    checkbox.setAttribute("onclick", "change_status("+all_tasks[i][0]+")");

		customDiv.appendChild(taskItem);
    customDiv.appendChild(checkbox);
    taskList_remaining.appendChild(customDiv);
		taskList_remaining.style.display = "block";
 
	}
}

var searchInput = document.getElementById('searchInput');
    var divContainer = document.getElementById('taskList_remaining');
    searchInput.addEventListener('input', function () {
      var searchQuery = searchInput.value.toLowerCase();
      var searchableDivs = document.querySelectorAll('.custom-div');
      searchableDivs.forEach(function (div) {
      var paragraphContent = div.querySelector('p').textContent.toLowerCase();
      if (paragraphContent.includes(searchQuery)) {
          div.style.display = 'flex';
        } else {
          div.style.display = 'none';
        }
      });
    });