"use strict";

const YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";

function retrieveInstructionalVideosFromApi(exerciseName, callback) {
    const settings = {
        url: YOUTUBE_SEARCH_URL,
        data: {
            part: "snippet",
            key: config.YOUTUBE_KEY,
            q: `How to perform ${exerciseName} workout`,
            maxResults: 2
        },
        dataType: "json",
        type: "GET",
        success: callback
    }

    $.ajax(settings);
}

function createYTPlayer(YTPlayerInfo) {
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
        $(`#${video.id} .ytp-title-channel-name`).text("test");
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



var currentMuscleCategory = "";

var exerciseNumber = 0;

const MUSCLE_IMAGE_MAP = {
    8: "arms.jpg",
    9: "legs.webp",
    10: "abs-1.jpg",
    11: "chest.webp",
    12: "back.jpg",
    13: "shoulders.jpg",
    14: "calves.png"
}

function renderMuscleCategoryButtons(data) {
    let buttonTemplate = "";
    data.results.forEach(muscleCategory => {
        buttonTemplate += `<button style="background-image: url('Muscle_Category_Images/${MUSCLE_IMAGE_MAP[muscleCategory.id]}')" data-category-id="${muscleCategory.id}" 
        data-category-name="${muscleCategory.name}" data-hover="${muscleCategory.name}" class="muscle-category-button"><span class="hide-text">${muscleCategory.name}</span></button>
        `;
    });
    const muscleCategoryPage = `
    <nav class="muscle-category-page-nav">
        <button class="back-to-homepage-button">Back to Homepage</button>
    </nav>

    <section class="muscle-category-page">
        <h2 class="muscle-category-h2">Choose which muscle category you would like to focus on:</h2>
            
        <div class="muscle-category-button-template-div">
            ${buttonTemplate}
        </div>
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
        listTemplate += `<li><a href="javascript:void(0);" data-exercise-name="${exercise.name}" 
        data-exercise-id="${exercise.id}" class="exercise-link"<li>${exercise.name}</a></li>`;
    })

    const exerciseListPage = `
    <nav class="muscle-category-page-nav">
        <button class="back-to-homepage-button">Back to Homepage</button> 
        <button class="back-to-muscle-category-page-button">Back to Muscle Categories</button>
    </nav>
    <section class="exercise-list-page">
        <h2 class="recommended-exercises-h2">Recommended Exercises for ${currentMuscleCategory}</h2>
        <h3 class="exercise-link-h3">Choose any of the following exercises to access detailed information:</h3>

        <ul class="exercise-list">
            ${listTemplate}
        </ul>

    </section>`;

    $("#container").html(exerciseListPage);
}

function muscleCategoryPageSubmitButtons() {
    $("#container").on("click", ".muscle-category-button", function(event) {
        event.preventDefault();

        //Setting global variable currentMuscleCategory
        currentMuscleCategory = $(event.currentTarget).data("category-name");

        retrieveExercisesByCategoryIdFromApi($(event.currentTarget).data("category-id"), renderExercisesByMuscleCategory);
    });
}

function backToHomepageButton() {
    $("#container").on("click", ".back-to-homepage-button", function(event) {
        event.preventDefault();

        let homepageTemplate = `
        <section class="start-page">
            <h1 class="insaiyan-physique">Insaiyan Physique</h1>
            <h2 class="start-page-h2">A workout application to help you achieve your physique goals!</h2>
            <button class="initialize-app-button">Let's Go!</button>
        </section>`;

        $("#container").html(homepageTemplate);
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

function renderMuscleDiagram(muscles, diagramOrientation) {
    let diagramMusclesURLs = "";

    let imageName = diagramOrientation ? `muscular_system_front.svg` : `muscular_system_back.svg`;


    muscles.forEach(function(muscle) {
        diagramMusclesURLs += `url(Muscle_Diagram_Images/muscle-${muscle.id}.svg), `
    });

    return `<div class="diagram mobile-viewports" style="background-image:${diagramMusclesURLs}
        url(Muscle_Diagram_Images/${imageName});"></div>`;
            
}

function renderAllMuscleDiagrams(muscles, diagramOrientation) {
    let anteriorDiagramMusclesURLs = "";
  
    let anteriorMuscles = muscles.filter(function(muscle) {
        return muscle.is_front;
    });

    let posteriorMuscles = muscles.filter(function(muscle) {
        return !muscle.is_front;
    });

    anteriorMuscles.forEach(function(muscle) {
        anteriorDiagramMusclesURLs += `url(Muscle_Diagram_Images/muscle-${muscle.id}.svg), `
    });

    let anteriorDiagram = `<div class="diagram" style="background-image:${anteriorDiagramMusclesURLs}
        url(Muscle_Diagram_Images/muscular_system_front.svg);"></div>`

    let posteriorDiagramMusclesURLs = "";

    posteriorMuscles.forEach(function(muscle) {
        posteriorDiagramMusclesURLs += `url(Muscle_Diagram_Images/muscle-${muscle.id}.svg), `
    });

    let posteriorDiagram = `<div class="diagram" style="background-image:${posteriorDiagramMusclesURLs}
            url(Muscle_Diagram_Images/muscular_system_back.svg);"></div>`
            
    if(diagramOrientation) {
        $(".exercise-diagrams").append(anteriorDiagram, posteriorDiagram);
    }

    else {
        $(".exercise-diagrams").append(posteriorDiagram, anteriorDiagram);
    }
}

function renderExerciseInfo(data) {
    let equipmentTemplate = "";
    let primaryMuscleTemplate = "";
    let secondaryMuscleTemplate = "";

    for(let e of data.equipment) {
        equipmentTemplate += `<span class="equipment-span">${e.name}</span>`;
    }

    for(let e of data.muscles) {
        primaryMuscleTemplate += `<p>${e.name}</p>`
    }

    for(let e of data.muscles_secondary) {
        secondaryMuscleTemplate += `<p>${e.name}</p>`
    }

    let primaryMuscleDiagram = renderMuscleDiagram(data.muscles, data.muscles[0].is_front);

    let secondaryMuscleDiagram = renderMuscleDiagram(data.muscles_secondary, data.muscles_secondary[0].is_front);

    let exerciseInfoTemplate = `
    <nav class="exercise-info-page-nav">
        <button class="back-to-homepage-button">Back to Homepage</button>
        <button class="back-to-muscle-category-page-button">Back to Muscle Categories</button>
        <button class="back-to-exercise-list-page-button" data-category-id="${data.category.id}">Back to Exercise List</button>
    </nav>

    <h2 class="exercise-name-h2">${data.name}</h2>
    <h3 class="exercise-description"><span class="h3-span">Description</span></h3> ${data.description}
    <div class="exercise-images"></div>
    <h3 class="exercise-equipment"><span class="h3-span">Equipment</span></h3>
        <p>${equipmentTemplate}</p>
    <div class="target-muscles row center-justify-content-flex">
        <div class="col-6">
            <h3 class="primary-muscle">
                <span class="h3-span">Primary Target Muscle(s)</span>
            </h3>                
            ${primaryMuscleTemplate}
            ${primaryMuscleDiagram}
        </div>
        <div class="col-6">
            <h3 class="secondary-muscle">
                <span class="h3-span">Secondary Target Muscle(s)</span>
            </h3>                
            ${secondaryMuscleTemplate}
            ${secondaryMuscleDiagram}
    </div>
    `;

    $(".exercise-info").append(exerciseInfoTemplate);
    let allMuscles = data.muscles.concat(data.muscles_secondary);

    let diagramOrientation = data.muscles[0].is_front;

// renders diagrams in larger viewports
    renderAllMuscleDiagrams(allMuscles, diagramOrientation);

    retrieveExerciseImgFromApi(exerciseNumber, renderExerciseImages);
}

function renderExerciseImages(data) {
    let exerciseImagesTemplate = "";

    for(let i = 0; i < data.results.length; i++) {
        exerciseImagesTemplate += `<img alt="exercise-demonstration" class="images" src="${data.results[i].image}">`;
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

function exerciseInfoLinkClickHandler(data) {
    $("#container").on("click", ".exercise-link", function(event) {
        event.preventDefault();

        let exercisePageTemplate = `
        <section class=exercise-info-page>
            <section class="exercise-info"></section>
            <section class="exercise-diagrams"></section>
            <section class="exercise-comments"><h3 class="comments-h3"><span class="h3-span">Additonal Comments (if any): </span></h3></section>
            <section class="exercise-videos"><h3 class="exercise-videos-h3"><span class="h3-span">Instructional Videos</span></h3></section>
        </section>
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
    backToHomepageButton();
    muscleCategoryPageSubmitButtons();
    backToMuscleCategoryButton();
    backToExerciseListButton();
    exerciseInfoLinkClickHandler();
 }

 $(handleSubmitButtons);