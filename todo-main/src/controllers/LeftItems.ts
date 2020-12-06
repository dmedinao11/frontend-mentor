import { TodoItemTags } from "./DOMTemplates";

export class LeftItemsController {
	private viewElement: HTMLElement;
	private textTemplate = "{left} items left";

	constructor() {
		this.viewElement = document.getElementById("itemLeft") as HTMLParagraphElement;
		this.updateLeftItems(0);
	}

	public updateLeftItems(items: number): void {
		this.viewElement.innerHTML = this.textTemplate.replace(
			TodoItemTags.leftItem,
			items.toString()
		);
	}
}
