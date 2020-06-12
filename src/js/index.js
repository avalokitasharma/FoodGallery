import Search from './models/Search.js';
import Recipe from './models/Recipe.js';
import * as searchView from './views/searchView.js';
import * as recipeView from './views/recipeView.js';
import {elements, renderLoader, clearLoader} from './views/base.js';

/* global state of app
- search object
- current recipe object
- shopping list
- linked recipes
*/
const state = {};

//SEARCH CONTROLLER

const controlSearch = async () => {
	//1. get query from the view
	const query = searchView.getInput();

	//2. new search obj and add to state
	if(query){
		state.search = new Search(query);
	}

	//3. prepare UI for search results
	searchView.clearInput();
	searchView.clearResults();
	renderLoader(elements.searchRes);
	try{
		//4. search for recipes
		await state.search.getResults();

		//5. render search results on UI
		clearLoader();
		searchView.renderResults(state.search.results);
		
	} catch(error) {
		clearLoader();
		alert('Something went wrong with Search');
	}
	
}

elements.searchForm.addEventListener('submit', event => {
	event.preventDefault();
	controlSearch();
});

elements.searchResultPages.addEventListener('click', event =>  {
	const btn = event.target.closest('.btn-inline');
	if(btn){
		const gotoPage = parseInt(btn.dataset.goto);
		searchView.clearResults();
		searchView.renderResults(state.search.results, gotoPage);
	}
});

//RECIPE CONTROLLER

const controlRecipe = async () => {
	//get ID from URL
	const id = window.location.hash.replace('#','');

	if(id){
		//prepare UI for changes
		recipeView.clearResults();
		renderLoader(elements.recipe);

		//create new recipe object
		state.recipe = new Recipe(id);

		try{
			//get recipe data
			await state.recipe.getRecipe();
			state.recipe.parseIngredients();


			//calc servings and time
			state.recipe.calcServings();
			state.recipe.calcCookingTime();

			//render recipe
			clearLoader();
			recipeView.renderRecipeDetails(state.recipe);

		} catch(error) {
			clearLoader();
			alert('something went wrong');
		}
		
	}
}

['hashchange','load'].forEach(event => window.addEventListener(event, controlRecipe));