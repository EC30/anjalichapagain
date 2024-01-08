const renderSidebar = (placeholder: HTMLElement, active: string) => {
    fetch("../../components/sidebar/sidebar.html")
        .then((response) => response.text())
        .then((data) => {
            console.log(data);
            placeholder.innerHTML = data;
            const sidebarLinks = document.querySelectorAll(".sidebarlinks");
            for (const sidebarLInk of sidebarLinks) {
                sidebarLInk.classList.remove("active");
            }
            const currentPage = document.getElementById(active);
            currentPage!.classList.add("active");
        });
};
export default renderSidebar;