import { TodoItem, ITodoItem } from "./TodoItem";

export class TodoList {
	private items: TodoItem[];
	private static toSaveKey = "list";

	constructor() {
		this.items = this.load();
	}

	public add(content: string): TodoItem {
		const newItem = new TodoItem(content);
		this.items.unshift(newItem);
		this.save();
		return newItem;
	}

	public remove(id: number): void {
		this.items = this.items.filter((item) => item.id != id);
		this.save();
	}

	public updateCheck(id: number): void {
		const toUpdate = this.items.find((item) => item.id == id) as TodoItem;
		toUpdate.isChecked = !toUpdate.isChecked;
		this.save();
	}

	public updateOrder(id: number, settedPosition: number): void {
		const toChangeIndex = this.items.findIndex((item) => item.id == id);
		const [changedITem] = this.items.splice(toChangeIndex, 1);

		this.items.splice(settedPosition, 0, changedITem);

		this.save();
	}

	public removeCompleted(): void {
		this.items = this.active;
		this.save();
	}

	private load(): TodoItem[] {
		const savedList = localStorage.getItem(TodoList.toSaveKey);
		if (!savedList) return [];
		const listObject = JSON.parse(savedList) as ITodoItem[];
		return listObject.map((item) => new TodoItem("", item));
	}

	private save(): void {
		const toSave: ITodoItem[] = this.items.map((item) => item.toSave());
		const toSaveList = JSON.stringify(toSave);
		localStorage.setItem(TodoList.toSaveKey, toSaveList);
	}

	public get leftItems(): number {
		return this.active.length;
	}

	public get all(): TodoItem[] {
		return this.items;
	}

	public get completed(): TodoItem[] {
		return this.items.filter((item) => item.isChecked);
	}

	public get active(): TodoItem[] {
		return this.items.filter((item) => !item.isChecked);
	}

	public get totalTodos(): number {
		return this.items.length;
	}
}
