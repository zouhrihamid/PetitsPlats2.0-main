export default class Recipes {
    constructor(data) {
        this.id = data.id;
        this.image = data.image;
        this.name = data.name;
        this.servings = data.servings;
        this.ingredients = data.ingredients;
        this.time = data.time;
        this.description = data.description;
        this.appliance = data.appliance;
        this.ustensils = data.ustensils;
    }

    

    // Méthode pour créer la carte de recette HTML
    createRecipeCard() {
        const cardPlat = document.querySelector(".cardPlat");
        const articleRecipe = document.createElement('article');
        articleRecipe.classList.add('recipe');

        const imageElement = document.createElement('img');
        imageElement.src = `assets/image/${this.image}`;
        imageElement.alt = this.name;

        const timeElement = document.createElement('span');
        timeElement.classList.add("recipe-time");
        timeElement.textContent = `${this.time} min`;

        const nameElement = document.createElement('h2');
        nameElement.textContent = this.name;

        const recipeDescriptionTitle = document.createElement('h3');
        recipeDescriptionTitle.textContent = "Recette";

        const descriptionElement = document.createElement('p');
        descriptionElement.textContent = this.description;

        const ingredientsTitle = document.createElement('h3');
        ingredientsTitle.textContent = "Ingrédients";

        const ingredientsContainer = document.createElement('div');
        ingredientsContainer.classList.add('cardIngredient');

        this.ingredients.forEach(ingredient => {
            const ingredientText = document.createElement('p');
            ingredientText.classList.add('ingredient');

            const ingredientName = document.createElement('span');
            ingredientName.classList.add('ingredientName');
          
            ingredientName.textContent = `${ingredient.ingredient}`;

            const quantityText = document.createElement('span');
            const quantity = ingredient.quantity ? ingredient.quantity : '-';
            const unit = ingredient.unit ? ` ${ingredient.unit}` : '';
            quantityText.classList.add('quantityText');
            quantityText.textContent = `${quantity}${unit}`;

            ingredientText.appendChild(ingredientName);
          
            ingredientText.appendChild(quantityText);

            ingredientsContainer.appendChild(ingredientText);
        });

        articleRecipe.appendChild(imageElement);
        articleRecipe.appendChild(timeElement);
        articleRecipe.appendChild(nameElement);
        articleRecipe.appendChild(recipeDescriptionTitle);
        articleRecipe.appendChild(descriptionElement);
        articleRecipe.appendChild(ingredientsTitle);
        articleRecipe.appendChild(ingredientsContainer);

        cardPlat.appendChild(articleRecipe);
    }
}