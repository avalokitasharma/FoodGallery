import {elements} from './base.js';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
	elements.searchInput.value = '';
};

export const clearResults = () => {
	elements.searchResList.innerHTML = '';
	elements.searchResultPages.innerHTML = '';
};

const limitRecipeTitle = (title, limit = 17) => {
	const newTitle = [];
	if(title.length > limit){
		title.split(' ').reduce((acc, cur) =>{
			if(acc + cur.length <= limit){
				newTitle.push(cur);
			}
			return acc + cur.length;
		},0);
		return `${newTitle.join(' ')}...`;
	}
	return title;
}
const renderRecipe = (recipe) => {
	const markup = `<li>
                    <a class="results__link" href="#${recipe.recipe_id}">
                        <figure class="results__fig">
                            <img src="${recipe.image_url}" alt="Test">
                        </figure>
                        <div class="results__data">
                            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                            <p class="results__author">${recipe.publisher}</p>
                        </div>
                    </a>
                </li>`;
    elements.searchResList.insertAdjacentHTML('beforeend',markup);
};

const createButton = (page, type) => {
	return `<button class="btn-inline results__btn--${type}" data-goto=${type === 'prev'? page-1:page+1}>
				<span>Page ${type === 'prev'? page-1 : page+1}</span>
		        <svg class="search__icon">
		            <use href="img/icons.svg#icon-triangle-${type === 'prev'?'left':'right'}"></use>
		        </svg>
		    </button>`;
}

const renderButtons = (page, numOfResults, resultsPerPage) => {
	const pages = Math.ceil(numOfResults/resultsPerPage);
	let button;
	if(pages>1 && page == 1){
		//only next btn
		button = createButton(page ,'next');
	} else if(page < pages){
		//both btns
		button = `${createButton(page,'prev')}
				  ${createButton(page,'next')}`;
	} else if( page == pages && pages > 1){
		//only prev btn
		button = createButton(page,'prev');
	}
	elements.searchResultPages.insertAdjacentHTML('afterbegin',button);
}

export const renderResults = (recipes, page = 1, resultsPerPage = 10) => {
	//render results
	const start = (page-1) * resultsPerPage;
	const end = resultsPerPage * page;
	recipes.slice(start, end).forEach(renderRecipe);

	//render pagination btns
	renderButtons(page, recipes.length, resultsPerPage);
}

