import view from "./navbar.component.html";
import "./navbar.component.scss";

export class NavbarComponent {
	public render(): HTMLElement {
		const header = document.createElement("header");
		header.innerHTML = view;

		header.getElementsByTagName("h4")[0].addEventListener("click", this.onGoToHome);
		header.getElementsByTagName("a")[0].addEventListener("click", this.onThemeModeChange);

		return header;
	}

	//Handlers
	public onThemeModeChange() {
		document.body.classList.toggle("dark");
	}

	public onGoToHome() {
		window.location.hash = "#/home";
	}
}
