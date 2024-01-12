const allSideMenu = document.querySelectorAll<HTMLAnchorElement>("#sidebar .side-menu.top li a");

allSideMenu.forEach((item: HTMLAnchorElement) => {
    const li = item.parentElement;

    item.addEventListener("click", function () {
        allSideMenu.forEach((i: HTMLAnchorElement) => {
            i.parentElement?.classList.remove("active");
        });
        li?.classList.add("active");
    });
});

const menuBar = document.getElementById("toggle-button");
const sidebar = document.getElementById("sidebar");
// const sidebar=document.getElementById("sidebar-placeholder");
console.log(sidebar);

menuBar?.addEventListener("click", function () {
    sidebar?.classList.toggle("hide");
});


const searchButton = document.querySelector<HTMLButtonElement>("#content nav form .form-input button");
const searchButtonIcon = document.querySelector<HTMLElement>("#content nav form .form-input button .bx");
const searchForm = document.querySelector<HTMLElement>("#content nav form");

searchButton?.addEventListener("click", function (e) {
    if (window.innerWidth < 576) {
        e?.preventDefault();
        searchForm?.classList.toggle("show");
        if (searchForm?.classList.contains("show")) {
            searchButtonIcon?.classList.replace("bx-search", "bx-x");
        } else {
            searchButtonIcon?.classList.replace("bx-x", "bx-search");
        }
    }
});

if (window.innerWidth < 768) {
    sidebar?.classList.add("hide");
} else if (window.innerWidth > 576) {
    searchButtonIcon?.classList.replace("bx-x", "bx-search");
    searchForm?.classList.remove("show");
}

window.addEventListener("resize", function () {
    if (this.innerWidth > 576) {
        searchButtonIcon?.classList.replace("bx-x", "bx-search");
        searchForm?.classList.remove("show");
    }
});

const switchMode = document.getElementById("switch-mode") as HTMLInputElement;

switchMode?.addEventListener("change", function () {
    if (this.checked) {
        document.body.classList.add("dark");
    } else {
        document.body.classList.remove("dark");
    }
});
