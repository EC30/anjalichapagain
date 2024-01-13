// nav.ts

const renderNavbar = async (placeholder: HTMLElement): Promise<void> => {
    try {
        const response = await fetch("../../components/sidebar/navbar.html");
        const data = await response.text();
        placeholder.innerHTML = data;
    } catch (error) {
        console.error(error);
    }
};

export default renderNavbar;
