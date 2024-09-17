import { recipes } from "./recipes.js";
import Recipes from './cardRecipe.js';

// *************Sélection des éléments du DOM         ********************************/
const searchInput = document.querySelector(".search-input");
const removeIcon = document.querySelector(".remove-icon");
const searchIcon = document.querySelector(".search-icon");
const counterreceip = document.querySelector(".counter");
const globalSelectedOptionContainer = document.querySelector(".global-selected-option-display");



//***************** Gestion des éléments sélectionnés : ingrédients, appareils, ustensiles ***********************/
const globalSelectedItems = {
    ingredients: new Set(),
    appliances: new Set(),
    ustensils: new Set()
};



//********************  Fonction pour désactiver tous les menus déroulants ouverts *********************************/
function deactivateAllDropdowns(container) {
   
    const allContainers = document.querySelectorAll('.select-box > div');
    

    for (let i = 0; i < allContainers.length; i++) {
        const cont = allContainers[i];
        
       
        if (cont !== container) {
            cont.classList.remove("active");
                
            const options = cont.querySelector(".option-container");
            if (options) {
                options.classList.remove("active");
            }
           
            const searchBox = cont.querySelector(`[class*='search-box-']`);
            if (searchBox) {
                searchBox.classList.remove("active");
            }
        }
    }
}



//******************* Fonction pour mettre à jour l'affichage des tags sélectionnés  ***************************/
function updateSelectedDisplay() {
    globalSelectedOptionContainer.innerHTML = ''; 

    
    const categories = Object.keys(globalSelectedItems);
    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        const items = Array.from(globalSelectedItems[category]);

        
        for (let j = 0; j < items.length; j++) {
            const item = items[j];

            const selectedItem = document.createElement("div");
            selectedItem.classList.add("selected-item");

            const selectedText = document.createElement("span");
            selectedText.classList.add("selected-text");
            selectedText.innerText = item.charAt(0).toUpperCase() + item.slice(1).toLowerCase();
            selectedItem.appendChild(selectedText);

            const removetag = document.createElement("i");
            removetag.classList.add("fas", "fa-times", "removeOption");
            selectedItem.appendChild(removetag);

            removetag.addEventListener("click", () => {
               
                
                for (let k = 0; k < categories.length; k++) {
                    const cat = categories[k];
                    globalSelectedItems[cat].delete(item);
                }
                updateSelectedDisplay();
                updateOptionsAndFilter();
            });

            globalSelectedOptionContainer.appendChild(selectedItem);
        }
    }

    // Mettre à jour l'affichage du conteneur globalSelectedOptionContainer
    let hasSelectedItems = false;
    const selectedItemsSets = Object.values(globalSelectedItems);
    for (let i = 0; i < selectedItemsSets.length; i++) {
        if (selectedItemsSets[i].size > 0) {
            hasSelectedItems = true;
            break;
        }
    }
    globalSelectedOptionContainer.style.display = hasSelectedItems ? "flex" : "none";
}





//************************************  Fonction pour mettre à jour les options affichées dans les menus déroulants   boucle for ************/
function updateOptions(items, optionContainer, category) {
    
    if (!globalSelectedItems[category]) {
        return;
    }

   
    optionContainer.innerHTML = '';

  
    const uniqueItems = [...new Set(items.map(item => item.toLowerCase()))];
    uniqueItems.sort();

   
    for (let i = 0; i < uniqueItems.length; i++) {
        const item = uniqueItems[i];

        const divOption = document.createElement("div");
        divOption.classList.add("option");

        const input = document.createElement("input");
        input.setAttribute("type", "radio");
        input.classList.add("radio");
        input.setAttribute("name", item);
        input.setAttribute("id", item);

        const label = document.createElement("label");
        label.setAttribute("for", item);
        label.innerText = item.charAt(0).toUpperCase() + item.slice(1); // Afficher avec majuscule initiale

        divOption.appendChild(input);
        divOption.appendChild(label);

       
        const removetag = document.createElement("i");
        removetag.classList.add("fas", "fa-times", "removeOption");
        divOption.appendChild(removetag);

       
        if (globalSelectedItems[category].has(item)) {
            divOption.classList.add('selected');
        }

      
        divOption.addEventListener("click", () => {
            if (globalSelectedItems[category].has(item)) {
                globalSelectedItems[category].delete(item);
                divOption.classList.remove('selected');
            } else {
                globalSelectedItems[category].add(item);
                divOption.classList.add('selected');
            }
            updateSelectedDisplay();
            updateOptionsAndFilter();
        });

      
        removetag.addEventListener("click", (e) => {
            e.stopPropagation();
            if (globalSelectedItems[category].has(item)) {
                globalSelectedItems[category].delete(item);
                divOption.classList.remove('selected');
                updateSelectedDisplay();
                updateOptionsAndFilter();
            }
        });

      
        optionContainer.appendChild(divOption);
    }
}

//***************************** Fonction pour mettre à jour les options et filtrer les recettes  **************************/
function updateOptionsAndFilter() {
    const ingredientsContainer = document.querySelector(".ingredients .option-container");
    const appliancesContainer = document.querySelector(".Appareil .option-container");
    const ustensilsContainer = document.querySelector(".ustensils .option-container");
   
    
    updateOptions(ingredients, ingredientsContainer, "ingredients");
    updateOptions(appliances, appliancesContainer, "appliances");
    updateOptions(ustensils, ustensilsContainer, "ustensils");

    filterRecipes();
}



//*****************************  Fonction pour filtrer les options selon le texte entré   avec boucle for***********************************/
function filterOptions(searchValue, container) {
    const options = container.querySelectorAll(".option");

   
    for (let i = 0; i < options.length; i++) {
        const option = options[i];
        const label = option.querySelector("label").innerText.toLowerCase();

        
        if (label.includes(searchValue)) {
            option.style.display = "block";  
        } else {
            option.style.display = "none";   
        }
    }
}


//******************************* Fonction pour créer un menu déroulant **********************************************/
function createSelectBox(className, labelText, items) {
    const container = document.createElement("div");
    container.classList.add(className);

    const selected = document.createElement("div");
    selected.classList.add(`selected${className}`);
    selected.innerText = labelText;
    container.appendChild(selected);

    const searchBox = document.createElement("div");
    searchBox.classList.add(`search-box-${className}`);
    container.appendChild(searchBox);

    const inputSearchBox = document.createElement("input");
    const divsearch = document.createElement("div");
    divsearch.classList.add('searchItem');
    divsearch.appendChild(inputSearchBox);

    const iconseachBox = document.createElement("i");
    iconseachBox.classList.add('fas', 'fa-search', 'style-search');
    divsearch.appendChild(iconseachBox);

    const removeSearchItem = document.createElement("i");
    removeSearchItem.classList.add('fa', 'fa-times', 'removeItem');
    divsearch.appendChild(removeSearchItem);

    searchBox.appendChild(divsearch);

    const optionContainer = document.createElement("div");
    optionContainer.classList.add("option-container");
    container.appendChild(optionContainer);

    // Initialiser les options
    updateOptions(items, optionContainer, className.toLowerCase()); 

    selected.addEventListener("click", () => {
        deactivateAllDropdowns(container);
        optionContainer.classList.toggle("active");
        container.classList.toggle("active");
        if (optionContainer.classList.contains("active")) {
            inputSearchBox.focus();
        }
    });

    iconseachBox.addEventListener("click", () => {
        filterOptions(inputSearchBox.value.toLowerCase(), optionContainer);
    });

    removeSearchItem.style.display = 'none';

    inputSearchBox.addEventListener("input", () => {
        const searchValue = inputSearchBox.value.trim().toLocaleLowerCase();
        filterOptions(searchValue, optionContainer);
        removeSearchItem.style.display = searchValue.length > 0 ? 'flex' : 'none';
    });

    removeSearchItem.addEventListener("click", () => {
        inputSearchBox.value = '';
        removeSearchItem.style.display = 'none';
        updateOptions(items, optionContainer, className.toLowerCase()); 
        filterOptions('', optionContainer); 
    });

    return container;
}


//*********************** Initialisation des données***********************************************
const ingredients = [...new Set(recipes.flatMap(recipe => recipe.ingredients.map(ing => ing.ingredient.toLowerCase())))];
const appliances = [...new Set(recipes.map(recipe => recipe.appliance.toLowerCase()))];
const ustensils = [...new Set(recipes.flatMap(recipe => recipe.ustensils.map(ust => ust.toLowerCase())))]


const selectBoxContainer = document.querySelector(".select-box");

const ingredientSelectBox = createSelectBox("ingredients", "Ingrédients", ingredients);
const applianceSelectBox = createSelectBox("Appareil", "Appareil", appliances);
const ustensilSelectBox = createSelectBox("ustensils", "Ustensiles", ustensils);

selectBoxContainer.appendChild(ingredientSelectBox);
selectBoxContainer.appendChild(applianceSelectBox);
selectBoxContainer.appendChild(ustensilSelectBox);




document.addEventListener("DOMContentLoaded", () => {
    updateOptionsAndFilter();
    filterRecipes(); 
   
    removeIcon.addEventListener("click", clearSearchInput);
    removeIcon.style.display = 'none';

    searchInput.addEventListener("input", () =>{
        const searchValue = searchInput.value.trim();
    if (searchValue.length > 0 ){
        removeIcon.style.display ='flex';
    }
    else{removeIcon.style.display ='none';}
        })

  searchIcon.addEventListener("click", () => {
        const searchValue = searchInput.value.trim();
       
        if (searchValue.length >= 3) {
            filterRecipesBySearchInput();
        } else {
            
            filterRecipes();
        }
    });
    
});

//******************************************* Fonction pour effacer l'entrée de recherche *************************** /
function clearSearchInput() {
    searchInput.value = '';
    removeIcon.style.display = 'none';
    filterRecipesBySearchInput();
}




//******************************************* Fonction pour afficher les recettes  ****************************************/
function displayRecipes(recipesList) {
    const cardPlat = document.querySelector(".cardPlat");
    cardPlat.innerHTML = '';

    recipesList.forEach(recipeData => {
        const recipe = new Recipes(recipeData);
        recipe.createRecipeCard();
    });
}




//****************************************** Fonction pour filtrer les recettes selon les sélections ***********************/
function filterRecipes() {
    
    const selectedIngredients = Array.from(globalSelectedItems.ingredients).map(item => item.toLowerCase());
    const selectedAppliances = Array.from(globalSelectedItems.appliances).map(item => item.toLowerCase());
    const selectedUtensils = Array.from(globalSelectedItems.ustensils).map(item => item.toLowerCase());

    const filteredRecipes = recipes.filter(recipe => {
        const recipeIngredients = recipe.ingredients.map(ing => ing.ingredient.toLowerCase());
        const recipeAppliance = recipe.appliance.toLowerCase();
        const recipeUtensils = recipe.ustensils.map(ust => ust.toLowerCase());

        const ingredientsMatch = selectedIngredients.length === 0 || selectedIngredients.every(ingredient => recipeIngredients.includes(ingredient));
        const appliancesMatch = selectedAppliances.length === 0 || selectedAppliances.includes(recipeAppliance);
        const ustensilsMatch = selectedUtensils.length === 0 || selectedUtensils.every(utensil => recipeUtensils.includes(utensil));

        return ingredientsMatch && appliancesMatch && ustensilsMatch;
    });

    displayRecipes(filteredRecipes);

    updateSelectBoxes(filteredRecipes);

    updateCounter(filteredRecipes.length);
}



//******************************************* Fonction pour filtrer les recettes selon l'entrée de recherche *********************************/
function filterRecipesBySearchInput() {
    console.log("Filtering recipes by search input..."); 
    const searchValue = searchInput.value.toLowerCase();
    
    const filteredRecipes = recipes.filter(recipe => {
        const recipeTitle = recipe.name.toLowerCase();
        const recipeDescription = recipe.description.toLowerCase();
        const recipeIngredients = recipe.ingredients.map(ing => ing.ingredient.toLowerCase());
        const recipeUstensils = recipe.ustensils.map(utensil => utensil.toLowerCase());

        return (
            recipeTitle.includes(searchValue) ||
            recipeDescription.includes(searchValue) ||
            recipeIngredients.some(ingredient => ingredient.includes(searchValue)) ||
            recipeUstensils.some(utensil => utensil.includes(searchValue))
        );
    });

    displayRecipes(filteredRecipes);

    updateSelectBoxes(filteredRecipes);
    updateCounter(filteredRecipes.length);
}




//********************************** Fonction pour mettre à jour les boîtes de sélection en fonction des recettes filtrées ************************/
function updateSelectBoxes(filteredRecipes) {
  
    const filteredIngredients = new Set(filteredRecipes.flatMap(recipe => recipe.ingredients.map(ing => ing.ingredient.toLowerCase())));
    const filteredAppliances = new Set(filteredRecipes.map(recipe => recipe.appliance.toLowerCase()));
    const filteredUtensils = new Set(filteredRecipes.flatMap(recipe => recipe.ustensils.map(ust => ust.toLowerCase())));

    console.log(filteredIngredients);
    console.log (filteredAppliances);
    console.log(filteredUtensils);

    updateSelectBox(".ingredients", filteredIngredients);
    updateSelectBox(".Appareil", filteredAppliances);
    updateSelectBox(".ustensils", filteredUtensils);
}


//  ******************************************* Fonction pour mettre à jour les options visibles dans les boîtes de sélection  avec for  ***********/
function updateSelectBox(className, filteredItems) {
    const options = document.querySelectorAll(`${className} .option`);
    
   
    for (let i = 0; i < options.length; i++) {
        const option = options[i];
        const label = option.querySelector("label").innerText.toLowerCase();
        
       
        if (filteredItems.has(label)) {
            option.style.display = "block";  
        } else {
            option.style.display = "none";   
        }
    }
}


//******************************** Fonction pour mettre à jour le compteur des recettes trouvées **********************************/
function updateCounter(count) {
    counterreceip.innerText = `${count} Recettes`;
}