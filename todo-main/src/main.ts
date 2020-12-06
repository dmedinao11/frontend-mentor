import { TodoList } from "./models/TodoList";
import { RendererController, Status } from "./controllers/Renderer";
import { DragController } from "./controllers/Drag";
import "../src/styles.css";
import { LeftItemsController } from "./controllers/LeftItems";

declare global {
	interface Window {
		onCBChange: (item: Element) => void;
		onDelete: (item: Element) => void;
		onAddItem: (item: HTMLInputElement, event: KeyboardEvent) => void;
		showNoNamePlaceholder: (item: HTMLInputElement) => void;
		onFilter: (item: Element, type: Status) => void;
		onClearCompleted: () => void;
		onDragStart: (item: HTMLElement) => void;
	}
}

const listContainer = document.getElementById("todoList") as HTMLElement;

const myList = new TodoList();
const rendererController = new RendererController(listContainer);
const dragController = new DragController(listContainer);
const leftItemController = new LeftItemsController();

let filterStatus: Status = "all";

rendererController.renderList(myList.all);
rendererController.setDraggable(true);
leftItemController.updateLeftItems(myList.leftItems);

//Handlers
window.onCBChange = (item: Element) => {
	item.classList.toggle("checked");
	myList.updateCheck(parseInt(item.id));
	leftItemController.updateLeftItems(myList.leftItems);
};

window.onDelete = (item: Element) => {
	myList.remove(parseInt(item.id));

	if (myList.totalTodos == 0) rendererController.renderList();

	item.remove();
	leftItemController.updateLeftItems(myList.leftItems);
};

window.onAddItem = (input: HTMLInputElement, event: KeyboardEvent) => {
	if (event.keyCode == 13) {
		event.preventDefault();

		if (!input.value || input.value == "") showNoNamePlaceholder(input);
		else {
			const newTodoItem = myList.add(input.value);
			rendererController.renderNew(newTodoItem, "start");
			rendererController.setDraggable(filterStatus == "all");
		}

		input.value = "";
		leftItemController.updateLeftItems(myList.leftItems);
	}
};

window.onFilter = (button: Element, filterReq: Status) => {
	if (filterReq == filterStatus) return;

	toggleActivedBefore(filterStatus);

	rendererController.renderFilter(filterReq);

	button.classList.toggle("active");

	filterStatus = filterReq;
};

window.onClearCompleted = () => {
	myList.removeCompleted();
	rendererController.renderList(myList.all);
	leftItemController.updateLeftItems(myList.leftItems);
};

window.onDragStart = (item: HTMLElement) => {
	dragController.onDragStart(item);
};

//Utilities
const showNoNamePlaceholder = (item: HTMLInputElement) => {
	item.placeholder = "Give a todo name!";

	setTimeout(() => {
		item.placeholder = "Create a new todo...";
	}, 1000);
};

const toggleActivedBefore = (id: string) => {
	const toDisable = document.getElementById(id);

	toDisable?.classList.toggle("active");
};
