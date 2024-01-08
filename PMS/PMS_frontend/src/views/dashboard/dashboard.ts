import "../../css/taskStyle.css";
import renderSidebar from "../../components/sidebar/sidebar";
const sidebar=document.getElementById("sidebar-placeholder") as HTMLElement;
window.onload = async () => {
    renderSidebar(sidebar, "sidebar-dashboard");
};