import {elements} from './base.js';
import {limitRecipeTitle} from './searchView.js';

export const toggleLikeBtn = isLiked => {
	const iconString = isLiked? 'icon-heart':'icon-heart-outline';
	document.querySelector('.recipe__love use').setAttribute('href',`img/icons.svg#${iconString}`);
};

export const toggleLikeMenu = numLikes => {
	elements.likesMenu.style.visibility = numLikes > 0? 'visible':'hidden';
};

export const renderLikes = like => {
	const markup = `<li>
                        <a class="likes__link" href="#${like.id}">
                            <figure class="likes__fig">
                                <img src="${like.img}" alt="${like.title}">
                            </figure>
                            <div class="likes__data">
                                <h4 class="likes__name">${limitRecipeTitle(like.title)}</h4>
                                <p class="likes__author">${like.author}</p>
                            </div>
                        </a>
                    </li>
				   `;
	elements.likesList.insertAdjacentHTML('beforeend',markup);
};

export const deleteLike = (id) => {
	const ele = document.querySelector(`.likes__link[href="#${id}"]`);
	if(ele) ele.parentElement.removeChild(ele);
}