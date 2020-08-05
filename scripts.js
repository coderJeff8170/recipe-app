console.log('hello!');

/* REQUIREMENTS
    * UI - Add Recipe Form
        * Recipe Name (text input) - X
        * Ingredients (textarea) - X
        * Preparation (textarea) - X
        * Add button (button) - X
            * prevent this button from being used unless all fields are filled out - X
        * Add global variables that call out the HTML variables and are used in this file
            * #name - X
            * #ingredients - X
            * #preparation - X
    * UI - Recipes Section - X
        * turn into accordian with bootstrap
    * JS - Event handler for Add button click - X
    * JS - Global variables
        * Storage Array - X
        * Default recipes - X
    * JS - Recipe class - X
    * JS - Store data in localstorage
    * JS - Retrieve data from localstorage so that persists on each load
    * JS - Func to add recipe to storage array and localstorage - X
    * JS - Func to remove individual recipe from localstorage
    * JS - Func to remove ALL recipes
*/

const nameField = document.querySelector("#name");
const ingredientsField = document.querySelector("#ingredients");
const prepField = document.querySelector("#preparation");
const recipeContainer = document.querySelector("#recipeContainer");
const recipeTemplate = document.querySelector("#recipe-template");
// append recipes to this element vvv
const recipesElement = document.querySelector("#all-recipes");
const addRecipeBtn = document.querySelector("#submitRecipe");

// Storage array for handling recipes
let allRecipes = [];

// Recipe class
class Recipe {
    constructor (name, ingredients, prep) {
        this.name = name;
        this.ingredients = ingredients;
        this.prep = prep;
        this.displayRecipe();
        this.elementReference;
    }
    // Create displayRecipe method
    displayRecipe(){
        //clone node using this particular element reference when constructor is called
        this.elementReference = recipeTemplate.cloneNode(true);
        //need references to each part of the recipe:
        const recipeNameElement = this.elementReference.querySelector(".recipe-name");
        const recipeIngredientElement = this.elementReference.querySelector(".recipe-ingredients");
        const recipePrepElement = this.elementReference.querySelector(".recipe-prep");
        //since there is more than one part to fill, use an array of objects to store the element reference and the text used to fill it
        const recipeElementArray = [
            {element: recipeNameElement, section: this.name },
            {element: recipeIngredientElement, section: this.ingredients },
            {element: recipePrepElement, section: this.prep },
            ];
        //make sure each is not an array, and fill it with current information
        recipeElementArray.map(el=>{
            if (!Array.isArray(el.element)) {
                el.element.innerText = el.section;
            }
        })
        //display the recipe
        this.elementReference.classList.remove("hide");
        //add recipe to the DOM
        recipesElement.appendChild(this.elementReference);
    }
}

//set initial button state
setButtonDisabled(true);

// Disable button function
// - to use this, all three fields must contain some sort of text....
function setButtonDisabled(isDisabled){
    addRecipeBtn.disabled = isDisabled;
}
// function to check if all fields are filled out
function onType() {
    if (!nameField.value||!ingredientsField.value||!prepField.value) {
        setButtonDisabled(true);
    } else {
        setButtonDisabled(false);
    }
}


// Event handlers for Add button click, Create Default Recipes
function onAddRecipe () {
    //instantiate current recipe using Recipe class and text entered into fields
    let newRecipe = new Recipe(nameField.value, ingredientsField.value, prepField.value);
    // store the recipe
    storeRecipe(newRecipe);

    // Clear all text fields
    nameField.value = null;
    ingredientsField.value = null;
    prepField.value = null;

    // Disable recipe submit button
    setButtonDisabled(true);
}

//store recipe in local storage
function storeRecipe(recipe) {
    // Add the recipe to the allRecipes array
    allRecipes.push(recipe);
    // Save allRecipes array to localStorage
    localStorage.setItem("recipes", JSON.stringify(allRecipes));
}

// create three default recipes and display them
function createDefaultRecipes () {

    const recipe1 = new Recipe(
        "Cream Scones",
        "2 cups flour, 5 tbsp butter (cold, cubed), 3 tbsp sugar, 1/2 tsp salt, 1 tbsp baking powder, 1 tbsp lemon zest (optional), 1 cup heavy cream",
        "Combine dry ingredients, blitz for 6 seconds. Add butter cubes, pulse for 10 seconds. Pour mixture into a bowl and add heavy cream slowly until sticky dough forms. Cut into wedges, bake at 425F for 11-15 minutes until golden brown."
    );
    const recipe2 = new Recipe(
        "Pancakes",
        "1cup all-purpose flour, 1/4 tsp salt, 1tsp sugar, 2tsp baking powder, 4tbsp butter, 1 cup milk, 1 egg",
        "Heat pan medium heat. Mix dry ingredients. Melt butter in measuring jug, add milk, then crack egg into liquid and whisk. Add liquid to dry ingredients, mix only until combined and lumpy. Pour into pan, flip when bubbles become holes around edges, and remove when golden brown on both sides. Serve warm with butter and maple syrup. Serves 8."
    );
    const recipe3 = new Recipe(
        "Pizza",
        "2 1/4 cups bread flour, divided, 1/4 tsp salt, 1tsp sugar, 2 1/4 tsp or 1 sachet bread yeast, 1tbsp olive oil, 3/4 cup warm water, 8oz tomato sauce, 16oz grated mozzarella cheese",
        "Dissolve yeast and sugar with warm water in measuring jug - set aside for 10 mins, or until creamy foam forms on surface. Combine 2cups flour and salt in large bowl. When yeast is active, pour liquid with olive oil into flour mixture, and combine until a ball of dough. Add flour as necessary, until ball no longer sticks to hands. Knead until a smooth ball, set aside, covered in bowl for 2 hours for dough to proof. Preheat oven to hottest temperature/550 F. Spread oil and flour over a large pizza pan/cookie sheet. Knead dough for several minutes, then roll out so it covers the pan, pushing and pulling on dough to shape. Spread sauce out thinly over dough, then cover with grated mozzarella and whatever toppings you like. Put in oven for 5-8 minutes, slice while hot."
    );
    //make array of def. recipes to make easier to deal with
    const defaultRecipes = [recipe1, recipe2, recipe3];

    // Call storeRecipe function on all three at once
    defaultRecipes.map(recipe=>storeRecipe(recipe));

    // The below code is just for reference
    // Retrieve items from localStorage:
    //  localStorage.getItem("recipes");
    // TODO: move this vvvv somewhere else / figure out what to do with it
    
}
//call out to provide default recipes
createDefaultRecipes();
let savedRecipes = JSON.parse(localStorage.getItem("recipes"));
    console.log(savedRecipes);