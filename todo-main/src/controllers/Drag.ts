export class DragController {
	private container: HTMLElement;
	private movedElement: HTMLElement | undefined;
	private positions: PositionsElements | undefined;
	private line: HTMLElement | undefined;

	constructor(container: HTMLElement) {
		this.container = container;
	}

	public onDragStart(item: HTMLElement): void {
		this.updatePositions();
		this.movedElement = item;
	}

	public onDragOver(posY: number): void {
		const overElement = this.positions?.getElement(posY);

		if (overElement != this.movedElement) {
			this.movedElement = overElement;
			this.updateLine();
		}
	}

	public onDragEnd(item: HTMLElement): number | undefined {
		this.line?.remove();
		this.line = undefined;
		if (this.movedElement != item) {
			item = this.container.removeChild(item);

			if (this.movedElement) this.container.insertBefore(item, this.movedElement);
			else this.container.appendChild(item);

			this.positions?.setPositions();
			return this.positions?.getIndex(item);
		}

		this.movedElement = undefined;
	}

	private updateLine(): void {
		if (!this.line) {
			this.line = document.createElement("hr");
			this.line.classList.add("line");
		}

		this.container.insertBefore(this.line, this.movedElement as HTMLElement);
	}

	private updatePositions(): void {
		const elementsList = Array.from(this.container.children) as HTMLElement[];

		this.positions = new PositionsElements(elementsList);
	}
}

interface ElementRelPosition {
	position: string;
	item: HTMLElement;
}

class PositionsElements {
	private elements: HTMLElement[];
	private posElementsSelections: ElementRelPosition[] | undefined;

	constructor(elements: HTMLElement[]) {
		this.elements = elements;
		this.setPositions();
	}

	public setPositions(): void {
		this.posElementsSelections = this.elements
			.reduce(this.calcReletaviPosReducer, [])
			.sort(this.compare);
	}

	public getElement(posY: number): HTMLElement | undefined {
		const foundElem = this.posElementsSelections?.find((element, index, items) => {
			const referencePoint = parseFloat(element.position);
			if (index == 0 || index == items.length - 1) return posY <= referencePoint;
			else return posY >= parseFloat(items[index - 1].position) && posY <= referencePoint;
		});

		return foundElem ? foundElem.item : undefined;
	}

	public getIndex(item: HTMLElement): number | undefined {
		return this.posElementsSelections?.findIndex((posElem) => posElem.item == item);
	}

	private calcReletaviPosReducer(
		acc: ElementRelPosition[],
		item: HTMLElement
	): ElementRelPosition[] {
		const { y, height } = item.getBoundingClientRect();

		const calcPosition = y + height / 2;
		const position = parseFloat(calcPosition.toString()).toFixed(2);
		acc.push({ position, item });
		return acc;
	}

	private compare(before: ElementRelPosition, current: ElementRelPosition) {
		if (before.position > current.position) return 1;

		if (before.position < current.position) return -1;

		return 0;
	}
}
