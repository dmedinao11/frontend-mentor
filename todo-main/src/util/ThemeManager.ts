export class ThemeManager {
	private storageKey = "theme";
	public theme: "sun" | "moon";

	constructor() {
		this.theme = this.loadTheme();
	}

	public saveTheme(theme: "sun" | "moon"): void {
		theme = theme == "sun" ? "moon" : "sun";
		localStorage.setItem(this.storageKey, theme);
	}

	private loadTheme(): "sun" | "moon" {
		const savedTheme = localStorage.getItem(this.storageKey);
		return savedTheme ? (savedTheme as "sun" | "moon") : "moon";
	}
}
