import { TodoItem } from "../models/TodoItem";
import { DomItems, TodoItemTags } from "./DOMTemplates";

export type Status = "all" | "completed" | "active";

export class RendererController {
	private container: HTMLElement;
	private noItems: NoItemsHideController | undefined;

	constructor(container: HTMLElement) {
		this.container = container;
	}

	public renderNew(item: TodoItem, position: "start" | "end"): void {
		const newItem = this.createNewTodoItem(item);
		const firstRenderedItem = this.container.firstChild;

		if (position == "start" && firstRenderedItem)
			this.container.insertBefore(newItem, firstRenderedItem);
		else this.container.appendChild(newItem);

		this.noItems?.hide();
	}

	public renderList(list: TodoItem[] = []): void {
		this.container.innerHTML = "";
		this.noItems = undefined;

		if (list.length == 0) this.renderNoItems();
		else list?.forEach((item) => this.renderNew(item, "end"));
	}

	public renderFilter(status: Status): number {
		this.noItems?.hide();

		const childNodes: HTMLElement[] = Array.from(
			this.container.children
		) as HTMLElement[];

		let counter = 0;

		const isAll = status == "all";

		childNodes.forEach((item: HTMLElement) => {
			const checkBox = item.getElementsByTagName("input")[0];

			if (!checkBox) return;

			const { checked } = checkBox;

			const mustToShow =
				isAll || (status == "active" && !checked) || (status == "completed" && checked);

			if (mustToShow) counter++;

			return mustToShow ? this.showTodoItem(item) : this.hideTodoItem(item);
		});

		if (counter == 0) this.renderNoItems();

		this.setDraggable(isAll);

		return counter;
	}

	public setDraggable(value: boolean): void {
		const childNodes: HTMLElement[] = Array.from(
			this.container.children
		) as HTMLElement[];

		childNodes.forEach((item) =>
			item.id != "noItems" ? this.setDraggableAttributes(item, value) : undefined
		);
	}

	private showTodoItem(item: HTMLElement) {
		item.style.display = "flex";
	}

	private hideTodoItem(item: HTMLElement) {
		item.style.display = "none";
	}

	private createNewTodoItem(item: TodoItem): HTMLElement {
		const newItem = document.createElement("li");
		const stId = item.id.toString();

		newItem.id = stId;
		newItem.classList.add("item", "todo-item");

		const htmlSt = DomItems.TodoItem.replace(TodoItemTags.content, item.content);

		newItem.innerHTML = htmlSt;

		if (item.isChecked) {
			newItem.classList.add("checked");
			newItem.getElementsByTagName("input")[0].checked = true;
		}

		return newItem;
	}

	private renderNoItems(): void {
		if (!this.noItems) {
			const noItems = document.createElement("li");
			noItems.classList.add("item", "no-items");
			noItems.id = "noItems";
			noItems.innerHTML = DomItems.NoItems;
			this.noItems = new NoItemsHideController(noItems);
			this.container.appendChild(noItems);
		}

		this.noItems.show();
	}

	private setDraggableAttributes(item: Element, value: boolean) {
		item.setAttribute("draggable", value.toString());
		item.setAttribute("ondragstart", "onDragStart(this)");
	}
}

class NoItemsHideController {
	private noItems: HTMLElement;

	constructor(reference: HTMLElement) {
		this.noItems = reference;
	}

	public hide(): void {
		this.noItems.style.display = "none";
	}

	public show(): void {
		this.noItems.style.display = "flex";
	}
}
