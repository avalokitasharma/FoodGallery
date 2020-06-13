import Search from './models/Search.js';
import Recipe from './models/Recipe.js';
import List from './models/List.js';
import Likes from './models/Likes.js';
import * as searchView from './views/searchView.js';
import * as recipeView from './views/recipeView.js';
import * as listView from './views/listView.js';
import * as likesView from './views/likesView.js';
import {elements, renderLoader, clearLoader} from './views/base.js';

/* global state of app
- search object
- current recipe object
- shopping list
- linked recipes
*/
const state = {};
window.state = state;

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

		//highlight selected search item
		if(state.search) searchView.highlightSelected(id);

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
			recipeView.renderRecipeDetails(state.recipe,state.likes.isLiked(id));

		} catch(error) {
			clearLoader();
			alert('something went wrong');
		}
		
	}
}

['hashchange','load'].forEach(event => window.addEventListener(event, controlRecipe));



//LIST CONTROLLER
const controlList = () => {
	//create empty list
	if(!state.list) state.list = new List();

	//add each ingredient to the list and to the UI
	state.recipe.ingredients.forEach(el => {
		const item = state.list.addItem(el.count, el.unit, el.ingredient);
		listView.renderItem(item);
	});
}

elements.shopping.addEventListener('click', event => {
	const id = event.target.closest('.shopping__item').dataset.itemid;

	//handling delete btn
	if(event.target.matches('.shopping__delete, .shopping__delete *')){
		//delete from state
		state.list.deleteItem(id);

		//delete from UI
		listView.deleteItem(id);
	} else if(event.target.matches('.shopping__count--value')){
		//update count in state
		const val = parseFloat(event.target.value,10);
		console.log(val)
		state.list.updateCount(id, val);
	}
});

//LIKE CONTROLLER

state.likes = new Likes();
const controlLike = () => {
	if(!state.likes) state.likes = new Likes();
	const currID = state.recipe.id;

	//if user has NOT yet liked the recipe
	if(!state.likes.isLiked(currID)){

		//add like to the state
		const newLike = state.likes.addLike(
			currID,
			state.recipe.title,
			state.recipe.author,
			state.recipe.img,
		);
		//toggle the like btn
		likesView.toggleLikeBtn(true);

		//render on the UI
		console.log(state.likes);

	//if user has liked the recipe
	} else{
		//remove like from the state
		state.likes.deleteLike(currID);

		//toggle the like btn
		likesView.toggleLikeBtn(false);

		//remove from the UI
		console.log(state.likes);
	}
}


//Handling recipe btn clicks

elements.recipe.addEventListener('click', event => {
	if(event.target.matches('.btn-decrease, .btn-decrease *')) {
		//dec btn is clicked 
		if(state.recipe.servings > 1){
			state.recipe.updateServings('dec');
			recipeView.updateServingIngredients(state.recipe);
		}

	} else if(event.target.matches('.btn-increase, .btn-increase *')) {
		//inc btn is clicked
		state.recipe.updateServings('inc');
		recipeView.updateServingIngredients(state.recipe);
	} else if(event.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
		controlList();
	} else if(event.target.matches('.recipe__love, .recipe__love *')) {
		controlLike();
	}
});

