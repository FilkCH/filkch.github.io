// TODO: Clicks into article item produce console error
// TODO: Filter and sorting functions
// TODO: Include nedb, express and REST API

import { themeHandler, setTheme } from "./utility/utility-theme-handler.js";
import toggleVisiblity from "./utility/utility-visibility-toggler.js";

//
// HANDLEBAR HELPERS
//

// Build a more verbose date helper
Handlebars.registerHelper("showNiceDate", (dueDate) => {
    const locale = navigator.language;
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const date = new Date(dueDate).toLocaleDateString(locale);
    if (date === new Date().toLocaleDateString(locale)) {
        return "Heute fällig.";
    }
    if (date === new Date(tomorrow).toLocaleDateString(locale)) {
        return "Morgen fällig."
    }
    return `Fällig am ${date}`;
});

// Set a checkbox to checked if conditions is met
Handlebars.registerHelper("boxChecker", (done) => {if (!done) { return "" } return "checked"});


//
// TEMPLATE RENDERING
//
const renderHTML = (todoData) => {
    const rawTemplate = document.querySelector('#todo-item-template').innerHTML;
    const compiledTemplate = Handlebars.compile(rawTemplate);
    const renderedOutput = compiledTemplate(todoData);

    const todoContainer = document.querySelector('.todos');
    todoContainer.innerHTML = renderedOutput;
}
// Set array and call rendering of initial view
let todoArray = JSON.parse(localStorage.getItem("todoArray") || "[]");
renderHTML(todoArray);


//
// VARIABLES
//
const storageContainer = 'todoArray';
const dataPopup = '[data-name="data-popup"]';
const settingsPopup = '[data-name="settings-popup"]';
const defaultHiddenClass = 'hidden';

//
// SELECTORS
//
const dataFormElements = document.querySelector('[data-element="form"]').elements;

const todoList = document.querySelector('[data-element="todolist"]');
const addButton = document.querySelector('[data-action="add-data"]');
const saveButton = document.querySelector('[data-action="save"]');
const closeButton = document.querySelector('[data-action="close"]');
const themeToggler = document.querySelector('[data-action="theme-toggler"]');

const titleField = document.querySelector('#title');
const doneCheckbox = document.querySelector('#done');
const priorityOne = document.querySelector('#one');
const priorityTwo = document.querySelector('#two');
const priorityThree = document.querySelector('#three');


//
// FUNCTIONS
//

// Set local storage container
const setLocalStorage = (container, array) => {
    localStorage.setItem(container, JSON.stringify(array));
};


// Handle list items by event type
const handleTodoList = (e) => {
    const item = e.target.closest('article');
    const id = parseInt(item.dataset.creationDate, 10);

    // Delete an item
    if (e.target.closest('div').matches('[data-action="delete"]')) {
        todoArray = todoArray.filter(entry => entry.creationDate !== id);
        setLocalStorage(storageContainer, todoArray);
    }

    // Edit an item
    if (e.target.closest('div').matches('[data-action="edit"]')) {
        toggleVisiblity(dataPopup, defaultHiddenClass);
        titleField.focus();

        const updateArray = todoArray.filter(entry => entry.creationDate === id);

        dataFormElements.title.value = updateArray[0].title;
        dataFormElements.duedate.value = new Date(updateArray[0].dueDate).toISOString().slice(0,10);

        if (updateArray[0].done === true) {
            dataFormElements.done.checked = true;
        }

        switch (updateArray[0].priority) {
            case '1':
                priorityOne.checked = true;
                break;
            case '2':
                priorityTwo.checked = true;
                break;
            case '3':
                priorityThree.checked = true;
                break;
            default:
                priorityOne.checked = true;
        }

        dataFormElements.setid.value = id;
    }
};

// Save a new item
const saveTodo = (e) => {
    e.preventDefault();

    if (!dataFormElements.setid.value) {
        todoArray.unshift({
            creationDate: Date.now(),
            dueDate: Date.parse(dataFormElements.duedate.value) || Date.now(),
            title: dataFormElements.title.value || "Ohne Titel",
            done: dataFormElements.done.checked || false,
            priority: dataFormElements.priority.value
        });
    } else {
        const foundItem = todoArray.find(entry => entry.creationDate === parseInt(dataFormElements.setid.value, 10));
        foundItem.title = dataFormElements.title.value || "Ohne Titel";
        foundItem.done = dataFormElements.done.checked || false;
    }

    setLocalStorage(storageContainer, todoArray);
};

// Reset all inputs fields
const resetInputFields = () => {
    dataFormElements.setid.value = '';
    dataFormElements.title.value = '';
    dataFormElements.duedate.value = new Date().toISOString().slice(0,10);
    doneCheckbox.checked = false;
    priorityThree.checked = true;
};

// Sort item array
const sortTodoItems = (arr, type, reverse) => {
    this.arr.sort((a,b) => a[this.type] - b[this.type]);
    return this.reverse ? this.arr.reverse() : this.arr;
}

// Filter item array
const filterTodoItems = (arr, filters) => {
    if (this.type === "done") {
        this.arr.filter(items => items.done === true);
    } else if (this.type === "priority") {
        this.arr.filter();
    }
    return this.arr;
}



//
// EVENT LISTENERS
//
saveButton.addEventListener('click', (e) => {
    saveTodo(e);
    toggleVisiblity(dataPopup, defaultHiddenClass);
    resetInputFields();
    renderHTML(todoArray);
});

todoList.addEventListener("click", (e) => {
    handleTodoList(e);
    renderHTML(todoArray);
});

closeButton.addEventListener('click', (e) => {
    e.preventDefault();
    toggleVisiblity(dataPopup, defaultHiddenClass);
    resetInputFields();
});

addButton.addEventListener('click', () => {
    resetInputFields();
    toggleVisiblity(dataPopup, defaultHiddenClass);
    titleField.focus();
});

themeToggler.addEventListener('click', () => {
    themeHandler();
});

window.addEventListener("DOMContentLoaded", () => setTheme());

