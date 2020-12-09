export class MediaQueryController {
	private container: HTMLElement;
	private beforeSiblingFooter: HTMLElement;
	private filter: HTMLElement;

	constructor() {
		this.container = document.getElementById("container") as HTMLElement;
		this.beforeSiblingFooter = document.getElementById("itemLeft") as HTMLElement;
		this.filter = document.getElementById("filter") as HTMLElement;
	}

	public updateMediaQuery(matches: boolean): void {
		if (matches) {
			this.container.insertAdjacentElement("afterend", this.filter);
			this.filter.classList.add("filter-container");
			this.filter.classList.add("item");
		} else {
			this.beforeSiblingFooter.insertAdjacentElement("afterend", this.filter);
			this.filter.classList.remove("filter-container");
			this.filter.classList.remove("item");
		}
	}
}
