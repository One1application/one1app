import {create} from "zustand"

export const useThemeSelectorStore = create((set) => ({
    theme : localStorage.getItem("userTheme") || "synthwave",
    setTheme : (theme) => {
        localStorage.setItem("userTheme", theme)
        set({theme : theme})
    }
}))