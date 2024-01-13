const renderSidebar = (placeholder: HTMLElement) => {
    fetch("../../components/sidebar/sidebar.html")
        .then((response) => response.text())
        .then((data) => {
            placeholder.innerHTML = data;
            // const allSideMenu = document.querySelectorAll<HTMLAnchorElement>("#sidebar .side-menu.top li a");

            // allSideMenu.forEach((item: HTMLAnchorElement) => {
            //     const li = item.parentElement;
            
            //     item.addEventListener("click", function () {
            //         allSideMenu.forEach((i: HTMLAnchorElement) => {
            //             i.parentElement?.classList.remove("active");
            //         });
            //         li?.classList.add("active");
            //     });
            // });
            
            // const menuBar = document.getElementById("toggle-button");
            // const sidebar = document.getElementById("sidebar");
            // console.log(sidebar);
            // console.log(menuBar);
            
            // menuBar?.addEventListener("click", function () {
            //     sidebar?.classList.toggle("hide");
            // });
            
        });
};
export default renderSidebar;