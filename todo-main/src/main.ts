//Assets
import "../src/styles.css";
import "../images/icon-moon.svg";
import "../images/icon-sun.svg";
import "../images/icon-cross.svg";

//Models
import { TodoList } from "./models/TodoList";

//Utilities
import { ThemeManager } from "./util/ThemeManager";

//Controllers
import { DragController } from "./controllers/Drag";
import { RendererController, Status } from "./controllers/Renderer";
import { LeftItemsController } from "./controllers/LeftItems";
import { MediaQueryController } from "./controllers/MediaQuery";

declare global {
	interface Window {
		onCBChange: (item: Element) => void;
		onDelete: (item: Element) => void;
		onAddItem: (item: HTMLInputElement, event: KeyboardEvent) => void;
		showNoNamePlaceholder: (item: HTMLInputElement) => void;
		onFilter: (item: Element, type: Status) => void;
		onClearCompleted: () => void;
		onDragStart: (item: HTMLElement) => void;
		onDragEnd: (item: HTMLElement) => void;
		onModeToggle: (img: HTMLElement) => void;
		defineTheme: (toDefine?: "sun" | "moon") => void;
	}
}

const listContainer = document.getElementById("todoList") as HTMLElement;

const myList = new TodoList();
const rendererController = new RendererController(listContainer);
const leftItemController = new LeftItemsController();

const themeManager = new ThemeManager();

let filterStatus: Status = "all";

rendererController.renderList(myList.all);
rendererController.setDraggable(true);
leftItemController.updateLeftItems(myList.leftItems);

const dragController = new DragController(listContainer);

//Defining media query behavior
const mediaController = new MediaQueryController();
const mediaQueryMatcher = window.matchMedia("(max-width: 520px)");
mediaController.updateMediaQuery(mediaQueryMatcher.matches);
mediaQueryMatcher.addListener((matcher) =>
	mediaController.updateMediaQuery(matcher.matches)
);

//Handlers
window.onload = () => {
	if (themeManager.theme == "sun") {
		const body = document.getElementsByTagName("body")[0];
		body.classList.toggle("light");
		const img = document.getElementById("modeSwitch") as HTMLElement;
		img.setAttribute("src", "./images/icon-moon.svg");
	}
};

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

document.ondragover = (event: DragEvent) => {
	const { y } = event;
	dragController.onDragOver(y);
};

window.onDragEnd = (item: HTMLElement) => {
	const indexMoved = dragController.onDragEnd(item);
	if (indexMoved) myList.updateOrder(parseInt(item.id), indexMoved);
};

window.onModeToggle = (img: HTMLElement) => {
	const body = document.getElementsByTagName("body")[0];
	const isLightMode = body.classList.toggle("light");
	const theme = isLightMode ? "moon" : "sun";
	img.setAttribute("src", `./images/icon-${theme}.svg`);
	themeManager.saveTheme(theme);
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
