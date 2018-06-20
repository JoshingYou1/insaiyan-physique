"use strict";

const YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search"

function retrieveInstructionalVideosFromApi(exerciseName, callback) {
    const settings = {
        url: YOUTUBE_SEARCH_URL,
        data: {
            part: "snippet",
            key: config.YOUTUBE_KEY,
            q: `How to perform ${exerciseName} exercise`,
            maxResults: 2
        },
        dataType: "json",
        type: "GET",
        success: callback
    }

    $.ajax(settings);
}

function createYTPlayer(YTPlayerInfo) {
    console.log(YTPlayerInfo);
    return new YT.Player(YTPlayerInfo.id, {
        height: '390',
        width: '640',
        videoId: YTPlayerInfo.videoId,
        host: "https://www.youtube.com"
    });
}

var youtubePlayerArray = [];

function onYouTubeIframeAPIReady() {
    youtubePlayerArray.forEach(function(video) {
        createYTPlayer(video);
    })
}

function renderExerciseVideos(data) {
    let exerciseVideoTemplate = "";

    youtubePlayerArray = [];

    for (let i = 0; i < data.items.length; i++) {
        let divId = `player${i}`;

        exerciseVideoTemplate += `<div id="${divId}"></div>`;
  
        youtubePlayerArray.push({videoId:data.items[i].id.videoId, id:divId})
        }

    $(".exercise-videos").append(exerciseVideoTemplate);

    onYouTubeIframeAPIReady();
  }

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
    console.log("exercise:", exerciseId);
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

function retrieveExerciseCommentsFromApi(exerciseId, callback) {
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

/*function debug(data) {
    console.log(data);
}*/

var currentMuscleCategory = "";

var exerciseNumber = 0;

const MUSCLE_IMAGE_MAP = {
    8: "arms.jpg",
    9: "legs.webp",
    10: "abs.jpg",
    11: "chest.jpg",
    12: "back.jpg",
    13: "shoulders.jpg",
    14: "calves.png"
}

function renderMuscleCategoryButtons(data) {
    let buttonTemplate = "";
    data.results.forEach(muscleCategory => {
        buttonTemplate += `<button data-category-id="${muscleCategory.id}" data-category-name="${muscleCategory.name}" class="muscle-category-button">
        ${muscleCategory.name}<img src="Muscle_Category_Images/${MUSCLE_IMAGE_MAP[muscleCategory.id]}"/>
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
        listTemplate += `<li><a href="javascript:void(0);" data-exercise-name="${exercise.name}" data-exercise-id="${exercise.id}" class="exercise-link"<li>${exercise.name}</a></li>`;
    })

    const exerciseListPage = `
        <section class="exercise-list-page">
            <h2>Recommended Exercises for ${currentMuscleCategory}</h2>
            <button class="back-to-muscle-category-page-button">Back to Muscle Categories</button>
            <h3>Choose any of the following exercises to access detailed information:<h2>

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

function renderMuscleDiagrams(muscles) {
    let anteriorDiagramMusclesURLs = "";
    //url(Muscle_Diagram_Images/muscle-14.svg)
    let anteriorMuscles = muscles.filter(function(muscle) {
        return muscle.is_front;
    });

    let posteriorMuscles = muscles.filter(function(muscle) {
        return !muscle.is_front;
    });

    anteriorMuscles.forEach(function(muscle) {
        anteriorDiagramMusclesURLs += `url(Muscle_Diagram_Images/muscle-${muscle.id}.svg), `
    });

    let anteriorDiagram = `<div class="anterior-diagram" style="background-image:${anteriorDiagramMusclesURLs}
        url(Muscle_Diagram_Images/muscular_system_front.svg);"></div>`

    let posteriorDiagramMusclesURLs = "";

    posteriorMuscles.forEach(function(muscle) {
        posteriorDiagramMusclesURLs += `url(Muscle_Diagram_Images/muscle-${muscle.id}.svg), `
    });

    let posteriorDiagram = `<div class="posterior-diagram" style="background-image:${posteriorDiagramMusclesURLs}
            url(Muscle_Diagram_Images/muscular_system_back.svg);"></div>`
            
    $(".exercise-diagrams").append(anteriorDiagram, posteriorDiagram);
}

function renderExerciseInfo(data) {
    let equipmentTemplate = "";
    let primaryMuscleTemplate = "";
    let secondaryMuscleTemplate = "";

    for(let e of data.equipment) {
        equipmentTemplate += `<p>${e.name}</p>`;
    }

    for(let e of data.muscles) {
        primaryMuscleTemplate += `<p>${e.name}</p>`
    }

    for(let e of data.muscles_secondary) {
        secondaryMuscleTemplate += `<p>${e.name}</p>`
    }

    let exerciseInfoTemplate = `
            <button class="back-to-muscle-category-page-button">Back to Muscle Categories</button>
            <button class="back-to-exercise-list-page-button" data-category-id="${data.category.id}">Back to Exercise List</button>
            <h2>${data.name}</h2>
            <p>${data.description}</p>
            <section class="exercise-images"></section>
            ${equipmentTemplate}
            ${primaryMuscleTemplate}
            ${secondaryMuscleTemplate}
            `;

    $(".exercise-info").append(exerciseInfoTemplate);

    let allMuscles = data.muscles.concat(data.muscles_secondary);

    renderMuscleDiagrams(allMuscles);
    retrieveExerciseImgFromApi(exerciseNumber, renderExerciseImages);
}

function renderExerciseImages(data) {
    let exerciseImagesTemplate = "";

    for(let i = 0; i < data.results.length; i++) {
        exerciseImagesTemplate += `<img src="${data.results[i].image}">`;
    }

    $(".exercise-images").append(exerciseImagesTemplate);
}

function renderExerciseComments(data) {
    let exerciseCommentsTemplate = "";

    for(let i = 0; i < data.results.length; i++) {
        exerciseCommentsTemplate += `<p>${data.results[i].comment}</p>`;
    }

    $(".exercise-comments").append(exerciseCommentsTemplate);
}

function exerciseInfoLinkClickHandler() {
    $("#container").on("click", ".exercise-link", function(event) {
        event.preventDefault();

        let exercisePageTemplate = `
        <section class="exercise-info"></section>
        <section class="exercise-diagrams"></section>
        <section class="exercise-comments"></section>
        <section class="exercise-videos"></section>
        `;

        $("#container").html(exercisePageTemplate);

        let exerciseId = $(event.currentTarget).data("exercise-id");
        let exerciseName = $(event.currentTarget).data("exercise-name");
        exerciseNumber = exerciseId;

        retrieveExerciseInfoFromApi(exerciseId, renderExerciseInfo);
        retrieveExerciseCommentsFromApi(exerciseId, renderExerciseComments);
        retrieveInstructionalVideosFromApi(exerciseName, renderExerciseVideos);

    });
}

function handleSubmitButtons() {
    startPageSubmitButton();
    muscleCategoryPageSubmitButtons();
    backToMuscleCategoryButton();
    backToExerciseListButton();
    exerciseInfoLinkClickHandler();
 }

 $(handleSubmitButtons);