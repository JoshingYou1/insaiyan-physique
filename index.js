"use strict";

const WORKOUT_BASE_URL = "https://wger.de/api/v2/";
const WORKOUT_URLS = {
    workout: WORKOUT_BASE_URL + "workout",         
    workoutsession: WORKOUT_BASE_URL + "workoutsession",
    schedulestep: WORKOUT_BASE_URL + "schedulestep",
    schedule: WORKOUT_BASE_URL + "schedule",
    day: WORKOUT_BASE_URL + "day",
    set: WORKOUT_BASE_URL + "set",
    setting: WORKOUT_BASE_URL + "setting",
    workoutlog: WORKOUT_BASE_URL + "workoutlog",
    userprofile: WORKOUT_BASE_URL + "userprofile",
    language: WORKOUT_BASE_URL + "language",
    daysofweek: WORKOUT_BASE_URL + "daysofweek",
    license: WORKOUT_BASE_URL + "license",
    repetitionunit: WORKOUT_BASE_URL + "setting-repetitionunit",
    weightunit: WORKOUT_BASE_URL + "setting-weightunit",
    exerciseinfo: WORKOUT_BASE_URL + "exerciseinfo",
    exercise: WORKOUT_BASE_URL + "exercise",
    equipment: WORKOUT_BASE_URL + "equipment",
    exercisecategory: WORKOUT_BASE_URL + "exercisecategory",
    exerciseimage: WORKOUT_BASE_URL + "exerciseimage",
    exercisecomment: WORKOUT_BASE_URL + "exercisecomment",
    muscle: WORKOUT_BASE_URL + "muscle",
    ingredient: WORKOUT_BASE_URL + "ingredient",
    weightunit: WORKOUT_BASE_URL + "weightunit",
    ingredientweightunit: WORKOUT_BASE_URL + "ingredientweightunit",
    nutritionplan: WORKOUT_BASE_URL + "nutritionplan",
    meal: WORKOUT_BASE_URL + "meal",
    mealitem: WORKOUT_BASE_URL + "mealitem",
    weightentry: WORKOUT_BASE_URL + "weightentry"
}

function retrieveDataFromApi(searchTerm, callback) {
    const settings = {
        url: WORKOUT_SEARCH_URL,
        q: `${searchTerm}`,
        dataType: "json",
        type: "GET",
        success: callback
    };

    $.ajax(settings);
}