import View from "./country-detail.html";
import "./country-detail.scss";

import { URLS } from "../../routes/index.routes";

import { CountriesService } from "../../services/countries.service";
import { ICountryDetail } from "../../models/countries.interfaces";

enum DOMData {
	Flag = "{flag}",
	Name = "{name}",
	NativeName = "{nativeName}",
	Population = "{population}",
	Region = "{region}",
	Subregion = "{subregion}",
	Capital = "{capital}",
	TopLevelDomain = "{topLevelDomain}",
	Currencies = "{currencies}",
	Languages = "{languages}"
}

export class CountryDetailPage {
	static async render(code: string) {
		let resp = (await CountriesService.getByCode(code)) as any;
		if (resp["status"]) {
			window.location.hash = URLS.notFound;
			return;
		}

		const country = resp as ICountryDetail;
		let viewFormat = View;
		viewFormat = viewFormat.replace(DOMData.Capital, country.capital);
		viewFormat = viewFormat.replace(DOMData.Flag, country.flag);
		viewFormat = viewFormat.replace(DOMData.Name, country.name);
		viewFormat = viewFormat.replace(DOMData.NativeName, country.nativeName);
		viewFormat = viewFormat.replace(
			DOMData.Population,
			Intl.NumberFormat().format(country.population)
		);
		viewFormat = viewFormat.replace(DOMData.Region, country.region);
		viewFormat = viewFormat.replace(DOMData.Subregion, country.subregion);

		let domains = "";
		country.topLevelDomain.forEach((domain) => (domains += `${domain} `));
		viewFormat = viewFormat.replace(DOMData.TopLevelDomain, domains);

		let currencies = "";
		country.currencies.forEach((currency) => (currencies += `${currency.name} `));
		viewFormat = viewFormat.replace(DOMData.Currencies, currencies);

		let lenguages = "";
		country.languages.forEach((language) => (lenguages += `${language.name} `));
		viewFormat = viewFormat.replace(DOMData.Languages, lenguages);

		const container = document.createElement("div");
		container.classList.add("container");
		container.innerHTML = viewFormat;

		const borders = container.getElementsByClassName("borders")[0] as HTMLDivElement;

		country.borders.forEach((border, index) => {
			const borderButton = document.createElement("button") as HTMLButtonElement;
			borderButton.id = border;
			borderButton.innerHTML = country.bordersSt[index];
			borderButton.addEventListener("click", CountryDetailPage.onBorderClick);
			borders.appendChild(borderButton);
		});

		return container;
	}

	static onBorderClick(event: MouseEvent) {
		const buttonTarget = event.target as HTMLButtonElement;
		window.location.hash = URLS.country + buttonTarget.id;
	}
}
