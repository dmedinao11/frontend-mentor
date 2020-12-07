import Home from "./home.html";
import Loader from "../../components/loader/loader.component.html";
import NotData from "../../components/no-data/no-data.component.html";
import "./home.scss";
import { CountriesService } from "../../services/countries.service";
import { ICountry, Region } from "../../models/countries.interfaces";
import { CardComponent } from "../../components/card/card.component";

export class HomePage {
	private regionSelect: Element | null;
	private regionOptions: HTMLDivElement;
	private conutriesData: ICountry[];

	constructor() {
		this.regionSelect = null;
		this.regionOptions = document.createElement("div");
		this.conutriesData = [];
		this.initDOMObjects();
	}

	public initDOMObjects() {
		this.regionOptions.id = "dropdown";
		this.regionOptions.classList.add("dropdown");

		Object.keys(Region).forEach((region) => {
			const option = document.createElement("span");
			option.classList.add("option");
			option.textContent = region;
			option.addEventListener("click", HomePage.onOptionClick);
			this.regionOptions?.appendChild(option);
		});
	}

	public async render(): Promise<HTMLDivElement> {
		const homeContainer = document.createElement("div");
		homeContainer.classList.add("container");
		homeContainer.innerHTML = Home;

		const searchBar = homeContainer.getElementsByTagName("input")[0];
		searchBar.addEventListener("input", HomePage.onSearchCountry);

		this.regionSelect = homeContainer.getElementsByClassName("select-content")[0];
		this.regionSelect.addEventListener("focus", this.onSelectFocus);
		this.regionSelect.addEventListener("blur", this.onSelectBlur);
		this.regionSelect.parentElement?.appendChild<Element>(this.regionOptions as Element);

		const cardsContainer = document.createElement("div");
		cardsContainer.id = "cards-grid";

		this.conutriesData = await CountriesService.getAll();
		this.conutriesData.forEach((country) =>
			cardsContainer.appendChild(CardComponent.render(country))
		);

		homeContainer.appendChild(cardsContainer);

		return homeContainer;
	}

	//Handlers
	public onSelectFocus() {
		this.regionOptions = document.getElementById("dropdown") as HTMLDivElement;
		this.regionOptions.style.display = "flex";
		this.regionOptions.classList.remove("hide");
		this.regionOptions.classList.add("expand");
	}

	public onSelectBlur() {
		this.regionOptions = document.getElementById("dropdown") as HTMLDivElement;

		this.regionOptions.classList.remove("expand");
		this.regionOptions.classList.add("hide");
	}

	static onOptionClick(event: MouseEvent) {
		const regionSelect = document.getElementsByClassName("select-content")[0];

		const target = event.target as Element;
		const regionClicked = target.textContent as Region;

		const selectTextContent = regionSelect.getElementsByTagName(
			"span"
		)[0] as HTMLSpanElement;
		selectTextContent.innerHTML = regionClicked;

		const cardsContainer = document.getElementById("cards-grid") as HTMLElement;
		cardsContainer.innerHTML = Loader;

		const countriesPromise =
			regionClicked == Region.All
				? CountriesService.getAll()
				: CountriesService.getByRegion(regionClicked);

		countriesPromise.then((resp) => HomePage.changeCountriesCards(cardsContainer, resp));
	}

	static onSearchCountry() {
		const searchBar = document.getElementById("search-bar") as HTMLInputElement;
		const term = searchBar.value;

		const cardsContainer = document.getElementById("cards-grid") as HTMLElement;
		cardsContainer.innerHTML = Loader;

		const countriesSearchPromise =
			!term || term == ""
				? CountriesService.getAll()
				: CountriesService.searchByName(term);

		countriesSearchPromise.then((resp) => {
			if (resp["status"]) resp = [];

			HomePage.changeCountriesCards(cardsContainer, resp);
		});
	}

	//Helpers
	static changeCountriesCards(container: HTMLElement, countries: ICountry[]) {
		container.innerHTML = "";

		if (!countries || countries.length == 0) {
			container.innerHTML = NotData;
			return null;
		} else countries.forEach((card) => container.appendChild(CardComponent.render(card)));
	}
}
