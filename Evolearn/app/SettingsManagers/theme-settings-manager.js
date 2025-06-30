import { lss, lsg } from "../AuxiliaryScripts/utils.js";

let themePreference;
initialize();

function initialize() {
  themePreference = lsg("ThemePreference");

  if (themePreference === null) {
    themePreference = "light";
    lss("ThemePreference", JSON.stringify(themePreference));
  } else {
    themePreference = JSON.parse(themePreference);
  }
}

function updateSettings() {
  lss("ThemePreference", JSON.stringify(themePreference));
}

function changeTheme(value) {
  themePreference = value;
  document.querySelector("html").dataset.bsTheme = value;
  updateSettings();
}

function getThemePreference() {
  return themePreference;
}

changeTheme(themePreference);

export { changeTheme, getThemePreference };
