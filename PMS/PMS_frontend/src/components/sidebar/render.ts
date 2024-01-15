import "../../css/taskStyle.css";
import renderSidebar from "../sidebar/sidebar";
import renderNavbar from "../sidebar/navbar";
import axios from "axios";

const sidebar = document.getElementById("sidebar-placeholder") as HTMLElement;
const navbar = document.getElementById("navbar-placeholder") as HTMLElement;

document.addEventListener("DOMContentLoaded", async () => {
    await renderSidebar(sidebar);
    await renderNavbar(navbar);

    const menuBar = document.getElementById("toggle-button");
    const sidebars = document.getElementById("sidebar");    

    menuBar?.addEventListener("click", function () {
        sidebars?.classList.toggle("hide");
    });
    const searchButton = document.getElementById("searchButton") as HTMLButtonElement;
    const searchButtonIcon = document.getElementById("searchIcon") as HTMLElement;
    const searchText = document.getElementById("searchText") as HTMLInputElement;
    const currentUrl = new URL(document.location.href);

    const searchQueryParam = currentUrl.searchParams.get("search");
    // Ensure search is a string (not null)
    const search = searchQueryParam !== null ? searchQueryParam : "";
    // Set the value to the input field
    searchText.value = search;
    const searchForm=document.getElementById("searchForm") as HTMLFormElement;
    searchForm.addEventListener("submit", async(e)=>{
        e.preventDefault();
        const search=searchText.value.trim();
        if(search === ""){
            window.location.href=`${window.location.origin}${window.location.pathname}`;
        }else{
            window.location.href=`${window.location.origin}${window.location.pathname}?search=${search}`;
        }
    });
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
        sidebars?.classList.add("hide");
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
    
    const logoutButton = document.getElementById("logout");
    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            const accessToken = localStorage.getItem("accessToken");
            if (!accessToken) {
                console.error("No access token found");
                return;
            }
            
            axios.get("http://localhost:8000/users/logout", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            window.location.href = "../../../index.html";
        });
    }


    try {
        const userNameElement = document.getElementById("userName") as HTMLElement;
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
        if (userNameElement) {
            userNameElement.textContent = userName;
        }

    } catch (error) {
        console.error("Error fetching user details or project data:", error);
    }
});

export default function formattedDate(date:Date){
    return [ 
        date.getFullYear(),
        date.getMonth()+1,
        date.getDate(),
    ].join("-");

}

