import axios from 'axios';

export default class Recipe {
	constructor(id){
		this.id = id
	};
	async getRecipe() {
		try{
			const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
			this.title = res.data.recipe.title;
			this.author = res.data.recipe.publisher;
			this.img = res.data.recipe.image_url;
			this.url = res.data.recipe.source_url;
			this.ingredients = res.data.recipe.ingredients;

		} catch(error){
			console.log(error);
			alert('Something went wrong');
		}
	}

	calcCookingTime() {
		//assuming it takes 5 min for each 3 ingredients
		const periods = Math.ceil(this.ingredients.length/3);
		this.time = periods * 5;
	}
	calcServings(){
		this.servings = 4;
	}

	parseIngredients() {
		const unitLong = ['tablespoons','tablespoons','teaspoons','teaspoon','ounce','ounces','cups','pounds'];
		const unitShort = ['tbsp', 'tbsp','tsp','tsp','oz','oz','cup','pound'];

		const newIngredients = this.ingredients.map(el => {
			//fix units
			let ingredient = el.toLowerCase();
			unitLong.forEach((unit, i) => {
				ingredient = ingredient.replace(unit,unitShort[i]);
			});

			//remove text in ()
			ingredient = ingredient.replace(/ *\([^)]*\) */g,' ');

			//parse ingredients into count, unit, ingredient
			const arrIng = ingredient.split(' ');
			const unitIndex = arrIng.findIndex(ele => unitShort.includes(ele));

			let objIng;
			if(unitIndex > -1){
				//if there is a unit
				//if 4 1/2 cups - arrcount = [4,1/2] --> eval(4+ 1/2)= 4.5
				//if 4 cups - arrcount = [4]
				const arrCount = arrIng.slice(0,unitIndex);
				let count;
				if(arrCount.length == 1){
					count = eval(arrIng[0].replace('-','+'));
				} else {
					count = eval(arrIng.slice(0,unitIndex).join('+'));
				}

				objIng = {
					count,
					unit:arrIng[unitIndex],
					ingredient:arrIng.slice(unitIndex+1).join(' ')
				};


			} else if(parseInt(arrIng[0],10)){
				//there is no unit, but a number
				objIng = {
					count: parseInt(arrIng[0],10),
					unit: '',
					ingredient: arrIng.slice(1).join(' ')
				};
			} else if( unitIndex == -1) {
				//no unit, no number
				objIng = {
					count: 1,
					unit: '',
					ingredient
				};
			}

			return objIng;
		});
		this.ingredients = newIngredients;
	}
}