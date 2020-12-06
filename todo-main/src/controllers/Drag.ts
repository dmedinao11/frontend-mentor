export class DragController {
	private container: HTMLElement;
	private draggedElement: HTMLElement | undefined;
	private positions: PositionsElements;
	private line: HTMLElement | undefined;

	constructor(container: HTMLElement) {
		this.container = container;
		const elementsList = Array.from(container.children) as HTMLElement[];
		this.positions = new PositionsElements(elementsList);
	}

	public onDragStart(item: HTMLElement): void {
		this.draggedElement = item;

		if (!this.line) this.createLine();
	}

	private createLine(): void {
		this.line = document.createElement("li");
		this.line.classList.add("line");
		this.container.insertBefore(this.line, this.draggedElement as HTMLElement);
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

	private calcReletaviPosReducer(
		acc: ElementRelPosition[],
		item: HTMLElement
	): ElementRelPosition[] {
		const { y, width } = item.getBoundingClientRect();
		const calcPosition = y + width / 2;
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
