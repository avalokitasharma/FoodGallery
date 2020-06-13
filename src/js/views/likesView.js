import {elements} from './base.js';

export const toggleLikeBtn = isLiked => {
	const iconString = isLiked? 'icon-heart':'icon-heart-outline';
	document.querySelector('.recipe__love use').setAttribute('href',`img/icons.svg#${iconString}`);
};

export const toggleLikeMenu = numLikes => {
	elements.likesMenu.styles.visibility = numLikes > 0? 'visible':'hidden';
};