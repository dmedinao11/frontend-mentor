export class IdManager {
	private storageKey = "id";
	private currID = 0;
	private static instance: IdManager;

	private constructor() {
		this.storageKey = "id";
		this.currID = this.loadId();
	}

	public static getInstance(): IdManager {
		if (!IdManager.instance) IdManager.instance = new IdManager();
		return IdManager.instance;
	}

	public generateId(): number {
		this.currID++;
		this.saveId();
		return this.currID;
	}

	private saveId(): void {
		localStorage.setItem(this.storageKey, this.currID.toString());
	}

	private loadId(): number {
		const savedId = localStorage.getItem(this.storageKey);
		return savedId ? parseInt(savedId) : 0;
	}
}
