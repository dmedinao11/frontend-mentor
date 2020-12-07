import "./style.scss";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { Router } from "./routes/index.routes";

class App {
	private router: Router;
	private header: HTMLElement;

	constructor() {
		this.router = new Router();
		this.header = document.getElementById("header") as HTMLElement;
		this.header.appendChild(new NavbarComponent().render());
		window.location.hash = "#/home";
	}

	public initApp() {
		this.router.navigate(window.location.hash);
		window.addEventListener("hashchange", () => {
			console.log("has changed ", window.location.hash);
			this.router.navigate(window.location.hash);
		});
	}
}

const app = new App();
app.initApp();
