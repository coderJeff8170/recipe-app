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
const searchInput = document.querySelector("#searchInput");
const emptyMessage = document.querySelector("#emptyMessage");
const removeAll = document.querySelector("#remove-all");

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

        //display the recipe and hide the empty message if it has it
        this.elementReference.classList.remove("hide");
        if(!emptyMessage.classList.contains("hide")){
            emptyMessage.classList.add("hide");
        }
        //add recipe to the DOM
        recipesElement.appendChild(this.elementReference);
        //set up remove button/method
        let removeButton = this.elementReference.querySelector(".remove-recipe");
        removeButton.onclick = this.onRemoveRecipe.bind(this);
        //increment recipe number each time a new Recipe is created
        recipeNumber++;
        //make sure the remove button shows
        removeAll.classList.remove("hide");
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

    sortRecipes();

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
        "Jammie Dodgers",
        "2.5 cups flour, 1stick of butter(cold, cubed), 1/2 cup sugar, 1/2 tsp salt, 1 tsp baking powder, 60g Tate & Lyle Golden Syrup(essential), 1egg, 6tbsp raspberry or strawberry jam",
        "Preheat oven 350F. Line two baking sheets with parchment. Combine dry ingredients, then cut in butter and mix until the consistency of cornmeal. Add whisked egg and golden syrup, mix until a ball of dough. Roll to 1/4inch thickness, and make rounds with a 2 1/2 - 3 inch cookie cutter, until dough is gone. Punch holes in half of the rounds, make more rounds with the reclaimed dough, and punch holes in half of those. Repeat until dough is gone. Bake rounds until golden brown, about 12-15 mins. Let cool. Apply jam to solid rounds, and put back in oven until jam is sticky, around 3 mins. Top the jammed solid rounds with the punched rounds, flat side to the jam. Enjoy."
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

    let i, switching, divs, shouldSwitch;
    //initialize state to start the iteration
    switching=true;
    //iterate over the recipe list looking for items to switch
    while(switching){
        switching=false;
        divs = document.querySelectorAll("#all-recipes > .recipe");
        for(i=0; i<(divs.length-1);i++){
            shouldSwitch=false;
            //if you find one..
            if(divs[i].id.toLowerCase()>divs[i+1].id.toLowerCase()){
                shouldSwitch=true;
                break;
            }
        }
        //..switch it out, and repeat.
        if(shouldSwitch){
            divs[i].parentNode.insertBefore(divs[i+1], divs[i]);
            switching=true;
        }
    }
    
}

//function to filter recipes by livesearch
function filterRecipes(){

    let filter, divs, div;
    filter = searchInput.value.toUpperCase();

    //get items from recipe container
    divs = recipesElement.querySelectorAll(".recipe");

    //loop through items, and display only those that match value of filter
    for(let i=0; i<divs.length; i++) {
        div = divs[i].id;
        if(div.toUpperCase().indexOf(filter) > -1) {
            divs[i].style.display = "";
        }else{
            divs[i].style.display = "none";
        }
    }
}

//TODO: make onConfirm function?

function onRemoveAll(){
    //TODO: remove hide class from emptyMessage

    //Ask if user is sure they want to remove recipes and cannot be undone.
    let answer = confirm('Are you sure you wish all recipes? (this cannot be undone)');

    if(answer){
        //TODO: Remove all recipes from storage array
        newRecipes=[];
        //Empty 'recipes' in local storage
        localStorage.setItem("recipes", null);
        //Remove recipes from the DOM
        document.querySelectorAll(".recipe").forEach(recipe=>recipe.remove());
        emptyMessage.classList.remove("hide");
        removeAll.classList.add("hide");
    }else{
        return;
    }
}

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
sortRecipes();

//set initial button state
setButtonDisabled(true);

//immediately create default recipes
createDefaultRecipes();
