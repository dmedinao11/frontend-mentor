export enum TodoItemTags {
	id = "{id}",
	content = "{content}",
	leftItem = "{left}"
}

export enum DomItems {
	TodoItem = `
    	<input type="checkbox" onchange="onCBChange(this.parentNode)"/>
		<p>{content}</p>
        <img src="../images/icon-cross.svg" alt="delete" onclick="onDelete(this.parentNode)" />`,
	NoItems = `
	    <p>There are no tasks in your ToDo</p>
	    <i class="fas fa-clipboard"></i>    
    `
}
