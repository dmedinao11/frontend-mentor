import { HomePage } from "../pages/home/home";
import { CountryDetailPage } from "../pages/country-detail/country-detail";
import loader from "../components/loader/loader.component.html";

export enum URLS {
	home = "#/home",
	country = "#/country/",
	notFound = "#/not-found"
}

export class Router {
	private appRoot: HTMLElement;

	constructor() {
		this.appRoot = document.getElementById("root") as HTMLElement;
	}

	public navigate(url: string) {
		this.appRoot = document.getElementById("root") as HTMLElement;
		this.appRoot.innerHTML = loader;

		if (new RegExp(URLS.home).test(url)) {
			const homePage = new HomePage();
			homePage.render().then((container) => {
				this.appRoot.innerHTML = "";
				this.appRoot.appendChild(container);
			});
		} else if (new RegExp(URLS.country).test(url)) {
			const urlTokenized = url.split("/");
			const code = urlTokenized[urlTokenized.length - 1];
			CountryDetailPage.render(code).then((result) => {
				if (!result) return;
				this.appRoot.innerHTML = "";

				this.appRoot.appendChild(result);
			});
		} else {
			console.log("404");
		}
	}
}
