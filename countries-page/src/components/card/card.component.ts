import View from "./card.component.html";
import "./card.component.scss";
import { ICountry } from "../../models/countries.interfaces";
import { URLS } from "../../routes/index.routes";

enum DOMData {
	Flag = "{flag}",
	Name = "{name}",
	Population = "{population}",
	Region = "{region}",
	Capital = "{capital}"
}

export class CardComponent {
	static render(country: ICountry): HTMLDivElement {
		const card = document.createElement("div");
		card.classList.add("card");
		card.id = country.alpha3Code;
		card.addEventListener("click", CardComponent.onCardClick);

		let viewFormat = View;

		viewFormat = viewFormat.replace(DOMData.Flag, country.flag);
		viewFormat = viewFormat.replace(DOMData.Capital, country.capital);
		viewFormat = viewFormat.replace(DOMData.Name, country.name);
		viewFormat = viewFormat.replace(
			DOMData.Population,
			Intl.NumberFormat().format(country.population)
		);
		viewFormat = viewFormat.replace(DOMData.Region, country.region);

		card.innerHTML = viewFormat;
		return card;
	}

	//Handlers
	static onCardClick(event: MouseEvent) {
		let card = event.target as HTMLElement;
		while (!card.classList.contains("card")) card = card.parentNode as HTMLElement;
		window.location.hash = `${URLS.country}${card.id}`;
	}
}
