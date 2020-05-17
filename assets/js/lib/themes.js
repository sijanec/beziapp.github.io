const THEME_COLOR_SCHEMES = {
    light: {
        "color-primary": "rgba(0, 128, 83, 1)",
        "color-secondary": "rgba(0, 77, 50, 1)",
        "color-accent": "rgba(0, 156, 101, 1)",
        "color-primary-light": "rgba(230, 250, 231, 1)",
        "color-invalid": "rgba(192, 0, 0, 1)",

        "background-color": "rgba(255, 255, 255, 1)",
        "background-accent": "rgba(0, 156, 101, 0.2)",

        "color-header-bold": "rgba(255, 255, 255, 1)",
        "color-header-span": "rgba(255, 255, 255, 1)",

        "color-text": "rgba(0, 0, 0, 1)",
        "color-table-hover": "rgba(242, 242, 242, 0.5)",

        "color-sidenav-background": "rgba(255, 255, 255, 1)",
        "color-sidenav-text": "rgba(0, 0, 0, 0.87)",
        "color-sidenav-header": "rgba(0, 0, 0, 0.54)",
        "color-divider": "rgba(224, 224, 224, 1)",

        "color-btn-flat": "rgba(52, 52, 52, 1)",
        "color-btn-flat-disabled": "rgba(178, 178, 178, 1)",

    },
    dark: {
        "color-primary": "rgba(0, 128, 83, 1)",
        "color-secondary": "rgba(0, 94, 61, 1)",
        "color-accent": "rgba(20, 117, 83, 1)",
        "color-primary-light": "rgba(6, 137, 9, 1)", // it's not really light anymore, is it?
        "color-invalid": "rgba(192, 0, 0, 1)",

        "background-color": "rgba(31, 31, 31, 1)",
        "background-accent": "rgba(0, 92, 44, 0.2)",

        "color-header-bold": "rgba(255, 255, 255, 1)",
        "color-header-span": "rgba(255, 255, 255, 1)",

        "color-text": "rgba(255, 255, 255, 1)",
        "color-table-hover": "rgba(70, 70, 70, 0.5)",

        "color-sidenav-background": "rgba(31, 31, 31, 1)",
        "color-sidenav-text": "rgba(255, 255, 255, 1)",
        "color-sidenav-header": "rgba(255, 255, 255, 0.54)",
        "color-divider": "rgba(80, 80, 80, 1)",

        "color-btn-flat": "rgba(178, 178, 178, 1)",
        "color-btn-flat-disabled": "rgba(52, 52, 52, 1)",
    }
}

function applyTheme(themeName) {
    for (const [property, value] of Object.entries(THEME_COLOR_SCHEMES[themeName])) {
        document.documentElement.style.setProperty(`--${property}`, value);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    localforage.getItem("theme").then((selectedTheme) => {
        if (selectedTheme == null) {
            let isOsDarkTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            applyTheme(isOsDarkTheme ? "dark" : "light");
        } else {
            applyTheme(selectedTheme);
        }
    });
});
