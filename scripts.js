console.log('hello!');

/* REQUIREMENTS
    *UI - Add a thumbnail image for each recipe
    *UI - if they try to click without filling out all fields, do an alert.
    * UI - Add Recipe Form
        * Add type of recipe dropdown or select for recipe filter
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
        * turn into accordian with bootstrap - X
        * make accordian dynamic - X
    * JS - Event handler for Add button click - X
    * JS - Global variables
        * Storage Array - X
        * Default recipes - X
    * JS - Recipe class - X
    * JS - Store data in localstorage - X
    * JS - Retrieve data from localstorage so that persists on each load -X
    * JS - Func to add recipe to storage array and localstorage - X
    * 
    * JS - Func to remove individual recipe from storage array and  localstorage - X
    * JS - Func to remove ALL recipes
    * JS/uI - "Are you sure?" modal for deletes
    * JS - func to filter recipes by type
    * UI - add recipe search/nav bar
    * UI - make recipe viewer window obvious
    * UI - Make recipes tabs on large screens, and accordion on small screens
*/

/* -------------------------------------------- global variables --------- */

const nameField = document.querySelector("#name");
const ingredientsField = document.querySelector("#ingredients");
const prepField = document.querySelector("#preparation");
const recipeContainer = document.querySelector("#recipeContainer");
const recipeTemplate = document.querySelector("#recipe-template");
const recipesElement = document.querySelector("#all-recipes");
const addRecipeBtn = document.querySelector("#submitRecipe");
const recipeSubmitForm = document.querySelector("#recipeSubmitForm");
const searchInput = document.querySelector("searchInput");

let recipeNumber = 0;
let savedRecipes = [];
let newRecipes = [];


/* -------------------------------------------- Classes --------- */
class Recipe {
    constructor (name, ingredients, prep) {
        this.recipeNumber = recipeNumber;
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
        //references to each part of the recipe template:
        const recipeNameElement = this.elementReference.querySelector(".recipe-name");
        const recipeBodyElement = this.elementReference.querySelector(".recipe-body");
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
        });
        //give each recipe a unique id
        this.elementReference.setAttribute("id", `${this.name}`);

        //set data-target and aria-controls on button to `collapse${recipeNumber}`
        recipeNameElement.setAttribute("data-target", `#collapse${recipeNumber}`);
        recipeNameElement.setAttribute("aria-controls", `collapse${recipeNumber}`);
        recipeBodyElement.setAttribute("id", `collapse${recipeNumber}`);

        //display the recipe
        this.elementReference.classList.remove("hide");
        //add recipe to the DOM
        recipesElement.appendChild(this.elementReference);
        //set up remove button/method
        let removeButton = this.elementReference.querySelector(".remove-recipe");
        removeButton.onclick = this.onRemoveRecipe.bind(this);
        //increment recipe number each time a new Recipe is created
        recipeNumber++;
    }

    onRemoveRecipe(){
        //Ask if user is sure they want to remove and cannot be undone.
        let answer = confirm('Are you sure you wish to remove this recipe? (this cannot be undone)');

        if(answer){
            //Remove recipe from storage array
            newRecipes.splice(newRecipes.findIndex(recipe => recipe.name === this.name), 1);
            //Remove from local storage
            localStorage.setItem("recipes", JSON.stringify(newRecipes));
            //Remove recipe from the DOM
            this.elementReference.remove();
        }else{
            return;
        }
    }
}

/* -------------------------------------------- functions --------- */



function onSearch(){
console.log(searchInput.value);
}

// Disable add recipe button unless all fields filled out
function setButtonDisabled(isDisabled){
    addRecipeBtn.disabled = isDisabled;
}

// TODO: maybe add an if statement so that a click will either send a message to fill out fields
// or if they are, execute the function.
// function to check if all fields are filled out
function onType() {
    if (!nameField.value||!ingredientsField.value||!prepField.value) {
        setButtonDisabled(true);
    } else {
        setButtonDisabled(false);
    }
}

//when recipe is added, create and store the recipe
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
    // collapse form
    recipeSubmitForm.classList.remove("show");
}

//function to recreate recipes from local storage
function recreateRecipes(name, ingredients, prep){
    let newRecipe = new Recipe(name, ingredients, prep);
    storeRecipe(newRecipe);
}

//store recipe in local storage
function storeRecipe(recipe) {
    // Add the recipe to the newRecipes array
    newRecipes.push(recipe);
    // Save newRecipes array to localStorage
    localStorage.setItem("recipes", JSON.stringify(newRecipes));
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
}

//function to sort recipe display area
function sortRecipes(){
    // let recipeList = document.querySelectorAll("#all-recipes > .recipe");
    // console.log(recipeList);
    let i, switching, divs, shouldSwitch;
    // recipeList = document.getElementById("#all-recipes");
    
    switching=true;
    while(switching){
        switching=false;
        // divs=recipeList.querySelectorAll('.recipe');
        divs = document.querySelectorAll("#all-recipes > .recipe");
        console.log(divs);
        for(i=0; i<(divs.length-1);i++){
            shouldSwitch=false;
            if(divs[i].id.toLowerCase()>divs[i+1].id.toLowerCase()){
                shouldSwitch=true;
                break;
            }
        }
        if(shouldSwitch){
            divs[i].parentNode.insertBefore(divs[i+1], divs[i]);
            switching=true;
        }
    }
    
}

//function to filter recipes by livesearch

/* -------------------------------------------- runtime code --------- */

//if local storage is empty, set savedrecipes to an empty array
if(JSON.parse(localStorage.getItem("recipes"))===null){
    savedRecipes = [];
}else{
    //if there are recipes in it, set savedrecipes to it's value
    savedRecipes = JSON.parse(localStorage.getItem("recipes"));
    console.log('the value of savedRecipes is', savedRecipes);
    //then map savedrecipes and make a new recipe for each one
    savedRecipes.map(recipe=>recreateRecipes(recipe.name, recipe.ingredients, recipe.prep));
}

//set initial button state
setButtonDisabled(true);

//immediately create default recipes
createDefaultRecipes();
