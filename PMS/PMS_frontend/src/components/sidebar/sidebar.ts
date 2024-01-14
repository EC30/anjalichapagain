const renderSidebar = (placeholder: HTMLElement) => {
    fetch("../../components/sidebar/sidebar.html")
        .then((response) => response.text())
        .then((data) => {
            console.log("renderingSidebar");
            placeholder.innerHTML = data;
            const allSideMenu = document.querySelectorAll<HTMLAnchorElement>("#sidebar .side-menu.top li a");
            console.log(allSideMenu);

            allSideMenu.forEach((item: HTMLAnchorElement) => {
                const li = item.parentElement;
                if(item.href===`${window.location.origin}${window.location.pathname}`){
                    console.log(item.text);
                    li?.classList.add("active");
                }
            });
            
        });
};
export default renderSidebar;