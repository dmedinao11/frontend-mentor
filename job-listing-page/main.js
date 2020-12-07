// DOM ELEMENTS
const header = document.querySelector("header");
const filterTags = document.getElementById("filterTags");
const container = document.getElementById("container");

// DATA
let selectedFilterTags = [];
let offertsList = [];

const tagsHTML = {
	new: `<span class="new">New!</span>`,
	featured: `<span class="featured">Featured</span>`,
	any: "<span>@</span>",
	filter: `
        <p>@</p>
        <span class="icon-content">
            <i class="fas fa-times"></i>
        </span>
  `
};

// MAIN

const getData = () => {
	fetch("data.json")
		.then((data) => data.json())
		.then((data) => {
			offertsList = data;
			document.getElementById("spinner").remove();
			renderData(offertsList);
		});
};

// HANDLERS

const onFilterTagClick = ({ target }) => {
	const toFilter = target.textContent;
	if (selectedFilterTags.indexOf(toFilter) >= 0) return;
	else selectedFilterTags.push(toFilter);

	const filterTagsStyles = getComputedStyle(filterTags);

	if (filterTagsStyles.display == "none") filterTags.style.display = "flex";

	const tag = document.createElement("span");
	tag.classList.add("filter-tag");
	tag.innerHTML = tagsHTML.filter.replace("@", toFilter);
	tag.getElementsByTagName("i")[0].addEventListener("click", onDeleteFilterTag);

	filterTags.appendChild(tag);

	filterCards();

	locateFilterTags();
};

const onDeleteFilterTag = ({ target }) => {
	const tagEvent = target.parentElement.parentElement;
	const tagName = tagEvent.textContent.trim();
	selectedFilterTags = selectedFilterTags.filter((tag) => tag != tagName);
	if (selectedFilterTags.length == 0) filterTags.style.display = "none";
	tagEvent.remove();
	filterCards();

	locateFilterTags();
};

// HELPERS

const renderData = (data) => {
	window.addEventListener("resize", () => {
		locateFilterTags();
		locateImgs();
	});
	container.innerHTML = "";
	data.forEach((offert) => {
		const card = document.createElement("div");
		card.classList.add("card");
		if (offert.featured) card.classList.add("featured");
		card.innerHTML = `
      <div class="general">
          <img src="${offert.logo}"/>
          <div class="general-tags">
              <span>${offert.company}</span>
          </div>
          <h3>${offert.position}</h3>
          <p>${offert.postedAt} · ${offert.contract} · ${offert.location}</p>
      </div>
  
      <div class="tags">
      </div>
      `;

		const generalTagsCont = card.getElementsByClassName("general-tags")[0];
		if (offert.new) generalTagsCont.innerHTML += tagsHTML.new;
		if (offert.featured) generalTagsCont.innerHTML += tagsHTML.featured;

		const otherTagsCont = card.getElementsByClassName("tags")[0];
		otherTagsCont.innerHTML += tagsHTML.any.replace("@", offert.role);
		otherTagsCont.innerHTML += tagsHTML.any.replace("@", offert.level);
		if (offert.languages) {
			offert.languages.forEach(
				(language) => (otherTagsCont.innerHTML += tagsHTML.any.replace("@", language))
			);
		}

		if (offert.tools) {
			offert.tools.forEach(
				(tool) => (otherTagsCont.innerHTML += tagsHTML.any.replace("@", tool))
			);
		}

		const tags = otherTagsCont.getElementsByTagName("span");
		for (let i = 0; i < tags.length; i++) {
			tags[i].addEventListener("click", onFilterTagClick);
		}

		container.appendChild(card);
	});

	locateImgs();
};

const locateFilterTags = () => {
	const { height } = header.getBoundingClientRect();
	filterTags.style.top = height + "px";
	filterTags.style.transform = `translate(0, -50%)`;

	const leftToCenter = filterTags.getBoundingClientRect().width / 2;
	filterTags.style.left = `calc(50% - ${leftToCenter}px)`;

	filterTags.style.maxWidth = "86%";
};

const locateImgs = () => {
	const cards = container.children;
	for (let i = 0; i < cards.length; i++) {
		const cardImg = cards[i].getElementsByTagName("img")[0];

		if (window.innerWidth <= 750) {
			cardImg.style.position = "absolute";
			const cardTop = cards[i].getBoundingClientRect().top;
			cardImg.style.top = 0;
		} else {
			cardImg.style.position = "relative";
			cardImg.style.top = 0;
		}
	}
};

const filterCards = () => {
	const filteredList = [];
	offertsList.forEach((offert) => {
		let tagInOffert = true;
		const offertSt = JSON.stringify(offert);
		selectedFilterTags.forEach(
			(selectedTag) => (tagInOffert = tagInOffert && offertSt.indexOf(selectedTag) >= 0)
		);
		if (tagInOffert) filteredList.push(offert);
	});

	renderData(filteredList);
};
