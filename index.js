"use strict";

const WORKOUT_BASE_URL = "https://wger.de/api/v2/";
const WORKOUT_URLS = {
            
    exerciseinfo: WORKOUT_BASE_URL + "exerciseinfo",
    exercise: WORKOUT_BASE_URL + "exercise",
    equipment: WORKOUT_BASE_URL + "equipment",
    exercisecategory: WORKOUT_BASE_URL + "exercisecategory",
    exerciseimage: WORKOUT_BASE_URL + "exerciseimage",
    exercisecomment: WORKOUT_BASE_URL + "exercisecomment",
    muscle: WORKOUT_BASE_URL + "muscle"
}

function retrieveExercisesByCategoryIdFromApi(categoryId, callback) {
    const settings = {
        url: WORKOUT_URLS.exercise,
        data: {
            license_author: "wger.de",
            language: 2,
            category: categoryId 
        },
        dataType: "json",
        type: "GET",
        success: callback
    };

    $.ajax(settings);
}

function retrieveExerciseInfoFromApi(exerciseId, callback) {
    const settings = {
        url: WORKOUT_URLS.exerciseinfo + "/" + exerciseId,
        data: {
            license_author: "wger.de",
            language: 2,
            exercise: exerciseId
        },
        dataType: "json",
        type: "GET",
        success: callback
    };

    $.ajax(settings);
}


function retrieveEquipmentFromApi(exerciseId, callback) {
    const settings = {
        url: WORKOUT_URLS.equipment,
        data: {
            license_author: "wger.de",
            language: 2,
            exercise: exerciseId
        },
        dataType: "json",
        type: "GET",
        success: callback
    };

    $.ajax(settings);
}

function retrieveMuscleCategoryFromApi(callback) {
    const settings = {
        url: WORKOUT_URLS.exercisecategory,
        data: {
            license_author: "wger.de",
            language: 2
        },
        dataType: "json",
        type: "GET",
        success: callback
    };

    $.ajax(settings);
}

function retrieveExerciseImgFromApi(exerciseId, callback) {
    const settings = {
        url: WORKOUT_URLS.exerciseimage,
        data: {
            exercise: exerciseId
        },
        dataType: "json",
        type: "GET",
        success: callback
    };

    $.ajax(settings);
}

function retrieveExerciseCommentFromApi(exerciseId, callback) {
    const settings = {
        url: WORKOUT_URLS.exercisecomment,
        data: {
            license_author: "wger.de",
            language: 2,
            exercise: exerciseId
        },
        dataType: "json",
        type: "GET",
        success: callback
    };

    $.ajax(settings);
}

function retrieveMuscleInfoFromApi(exerciseId, callback) {
    const settings = {
        url: WORKOUT_URLS.muscle,
        data: {
            license_author: "wger.de",
            language: 2
        },
        dataType: "json",
        type: "GET",
        success: callback
    };

    $.ajax(settings);
}

function debug(data) {
    console.log(data);
}

retrieveExerciseInfoFromApi(97, debug);

var currentMuscleCategory = "";

const MUSCLE_IMAGE_MAP = {
    8: "arms.image-path",
    9: "legs.image-path",
    10: "abs.image-path",
    11: "chest.jpg",
    12: "back.image-path",
    13: "shoulders.image-path",
    14: "calves.image-path"
}

function renderMuscleCategoryButtons(data) {
    let buttonTemplate = "";
    data.results.forEach(muscleCategory => {
        buttonTemplate += `<button data-category-id="${muscleCategory.id}" data-category-name="${muscleCategory.name}" class="muscle-category-button">
            <img src="Muscle_Category_Images/${MUSCLE_IMAGE_MAP[muscleCategory.id]}"/>
        </button>`;
    });
    const muscleCategoryPage = `
        <section class="muscle-category-page">
            <h2>Choose which muscle category you would like to focus on:</h2>

            ${buttonTemplate}

        </section>`;

    $("#container").html(muscleCategoryPage);
}

function startPageSubmitButton() {
    $("#container").on("click", ".initialize-app-button", function(event) {
        event.preventDefault();

        retrieveMuscleCategoryFromApi(renderMuscleCategoryButtons);
    });

}

function renderExercisesByMuscleCategory(data) {
    let listTemplate = "";
    data.results.forEach(exercise => {
        listTemplate += `<li><a href="javascript:void(0);" data-exercise-id="${exercise.id}" class="exercise-link"<li>${exercise.name}</a></li>`;
    })

    const exerciseListPage = `
        <section class="exercise-list-page">
            <h2>Recommended Exercises for ${currentMuscleCategory}</h2>
            <button class="back-to-muscle-category-page-button">Back to Muscle Categories</button>
            <h3>Choose any of the following exercises to access detailed information, including repitition and set ranges:<h2>

            <ul class="exercise-list">
                ${listTemplate}
            </ul>    

        </section>`;

    $("#container").html(exerciseListPage);
}

function muscleCategoryPageSubmitButtons() {
    $("#container").on("click", ".muscle-category-button", function(event) {
        event.preventDefault();

        //Setting global variable muscleCategoryName
        currentMuscleCategory = $(event.currentTarget).data("category-name");

        retrieveExercisesByCategoryIdFromApi($(event.currentTarget).data("category-id"), renderExercisesByMuscleCategory);
    });
}

function backToMuscleCategoryButton() {
    $("#container").on("click", ".back-to-muscle-category-page-button", function(event) {
        event.preventDefault();

        retrieveMuscleCategoryFromApi(renderMuscleCategoryButtons);
    });
}

function backToExerciseListButton() {
    $("#container").on("click", ".back-to-exercise-list-page-button", function(event) {
        event.preventDefault();

        retrieveExercisesByCategoryIdFromApi($(event.currentTarget).data("category-id"), renderExercisesByMuscleCategory);
    });
}

function exerciseInfoLink() {
    $("#container").on("click", ".exercise-link", function(event) {
        event.preventDefault();

        retrieveExerciseInfoFromApi($(event.currentTarget).data("exercise-id"), renderExerciseInfo);
    })
}

function renderExerciseInfo(data) {
    

    const exerciseInfoPage = `
        <section class="exercise-info-page">
            <button class="back-to-muscle-category-page-button">Back to Muscle Categories</button>
            <button class="back-to-exercise-list-page-button" data-category-id="${data.category.id}">Back to Exercise List</button>
            <h2>Exercise Details</h2>
            
            <div style="background-image:url(Muscle_Diagram_Images/muscle-14.svg),url(Muscle_Diagram_Images/muscular_system_front.svg);"></div>

            <p>${data.description}</p>

            
        </section>`;

    $("#container").html(exerciseInfoPage);
}

function handleSubmitButtons() {
    startPageSubmitButton();
    muscleCategoryPageSubmitButtons();
    backToMuscleCategoryButton();
    exerciseInfoLink();
    backToExerciseListButton(); 
 }

 $(handleSubmitButtons);