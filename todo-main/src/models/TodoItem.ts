import { IdManager } from "../util/IdManager";

export interface ITodoItem {
	id: number;
	content: string;
	isChecked: boolean;
}

export class TodoItem implements ITodoItem {
	private _id: number;
	private _content: string;
	private _isChecked: boolean;

	constructor(content: string = "", item?: ITodoItem) {
		const idManager = IdManager.getInstance();

		if (item) {
			const { id, content, isChecked } = item;

			this._id = id;
			this._content = content;
			this._isChecked = isChecked;
		} else {
			this._id = idManager.generateId();
			this._content = content;
			this._isChecked = false;
		}
	}

	public toSave(): ITodoItem {
		return {
			id: this._id,
			content: this._content,
			isChecked: this._isChecked
		};
	}

	public get id(): number {
		return this._id;
	}

	public get content(): string {
		return this._content;
	}

	public get isChecked(): boolean {
		return this._isChecked;
	}

	public set isChecked(v: boolean) {
		this._isChecked = v;
	}
}
