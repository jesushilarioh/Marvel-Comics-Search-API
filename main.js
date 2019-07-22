function character() {
    var urlQueryParameters = new URLSearchParams(window.location.search),
        queryParameterName = urlQueryParameters.get('name');

    if(queryParameterName !== null && queryParameterName !== '') {
        document.getElementById('name').value = queryParameterName;
        connection();

    } else {
        document.getElementById('connectionForm')
            .addEventListener('submit', connection);
    
    }
}

function connection() {

    document.getElementById('characterSpinnerSection')
        .innerHTML = '';

    document.getElementById('comicsSpinnerSection')
        .innerHTML = '';

    var xhr = new XMLHttpRequest();
    var name = document.getElementById('name').value;
    var params = "name=" + name;

    xhr.open('GET', '/connections/name-search.php?' + params, true);

    xhr.onloadstart = function() {
        document.getElementById('characterSpinnerSection')
                .innerHTML =
                '<strong id="spinnerText" class="text-primary">Loading character...</strong>' +
                '<div class="text-primary spinner-border ml-auto" role="status" ' +
                'aria-hidden="true" id="spinner"></div>';
    }

    xhr.onload = function () {
        if (this.status == 200) {
            var results = JSON.parse(this.responseText);

            if (results["data"].count === 0) {

                document.getElementById('characterSection')
                    .innerHTML = '<h2 id="characterMainTitle">No results for... ' + name + '</h2>';

                document.getElementById('characterSpinnerSection')
                    .innerHTML = '';

                document.getElementById('comicsSpinnerSection')
                    .innerHTML = '';

            } else {

                var characterAttributes = results["data"].results[0];
                var characterID = results["data"].results[0].id;
                var output = '';

                output += 
                '<h2 id="characterMainTitle">' + 'Character'+ '</h2>' +
                '<div class="card flex-md-row mb-4 box-shadow h-md-250" id="characterCard">' +
                    '<div id="characterImage">' +
                        '<img class="card-img-right flex-auto d-md-block img-fluid"' +
                        ' alt="Picture of ' + characterAttributes.name +
                        '" src="' + characterAttributes.thumbnail["path"] +
                        '.' + characterAttributes.thumbnail["extension"] + '">' +
                    '</div>' +
                    '<div class="card-body d-flex flex-column align-items-start">' +
                        '<h3 class="mb-0 text-dark" id="characterName">' + characterAttributes.name + '</h3>' +
                        '<p class="card-text mb-3" id="characterDescription">';
                            if (characterAttributes.description !== '') {
                                output += characterAttributes.description;
                            }
                output+='</p>' +
                        '<p class="text-muted mb-3" id="comicsAvailable">' +
                            'Comics: ' + characterAttributes.comics.available + ' | ' +
                            'Series: ' + characterAttributes.series.available + ' | ' +
                            'Stories: ' + characterAttributes.stories.available + ' | ' +
                            'Events: ' + characterAttributes.events.available +
                        '</p>' +
                        '<p class="mb-1 text-muted" id="characterInfoAttribution">' +
                            results["attributionText"] +
                        '</p>' +
                    '</div>' +
                '</div>';

                document.getElementById('characterSection')
                        .innerHTML = output;

                comics(characterID);

            }

        } else {
            console.log("onload error...");
        }
    }

    xhr.onloadend = function() {
        document.getElementById('characterSpinnerSection').innerHTML = '';
    }

    xhr.onerror = function () {
        console.log("onerror Error...");
    }

    xhr.send();
}


function comics(characterID) {

    var xhr = new XMLHttpRequest();

    xhr.open('GET', '/connections/character.php?character-id=' + characterID, true);

    xhr.onloadstart = function() {
        document.getElementById('comicsSpinnerSection')
                .innerHTML =
                '<strong id="spinnerText" class="text-danger">Loading comics below...</strong>' +
                '<div class="spinner-border text-danger ml-auto" role="status" ' +
                'aria-hidden="true" id="spinner"></div>';
    }
    xhr.onload = function () {
        if (this.status === 200) {

            var results = JSON.parse(this.responseText);
            var comics = results["data"].results;
            var comicSection = document.getElementById('comicSection');

            if (results["data"].count === 0) {
                var output = '';
                comicSection.innerHTML = output;
                comicSection.innerHTML = '<h2>No comics Available</h2>';
            } else {
                // comics available
                var output = '';
                var creators = '';

                output +=
                    '<h2 id="comicMainTitle">Comics</h2>' +
                    '<div class="card-columns">';

                for (const i in comics) {
                    if (comics.hasOwnProperty(i)) {
                        const comic = comics[i];

                        output +=
                            '<div class="card">' +
                                '<a href="/comic.php?comic-id=' + comic.id + '"><img src="' + comic.thumbnail["path"] +
                                '.' + comic.thumbnail["extension"] +
                                '" class="card-img-top" alt="' + comic.title + '"></a>' +
                                '<div class="card-body">' +
                                    '<h5 class="card-title">' + comic.title + '</h5>';

                        // if (comic.description != null) {
                        //     output += '<p style="font-size: 12px;" class="card-text">' +
                        //         comic.description +
                        //         '</p>';
                        // }


                        // output += '<p style="font-size: 12px;" class="card-text text-muted">Characters: ';

                        // for (const k in comic.characters.items) {
                        //     if (comic.characters.items.hasOwnProperty(k)) {
                        //         const character = comic.characters.items[k];
                        //         output += character.name.concat(', ');
                        //     }
                        // }

                        // output += '</p>';
                        // output += '<p style="font-size: 12px;" class="card-text text-muted">Creators: ';

                        // for (const j in comic.creators.items) {
                        //     if (comic.creators.items.hasOwnProperty(j)) {
                        //         const creator = comic.creators.items[j];

                        //         output += creator.name
                        //             .concat(' (' + creator.role + '), ');

                        //     }
                        // }

                        // output += '</p>';
                        output+='</div>' +
                                // '<div class="card-footer">' +
                                //     '<small style="line-height: 1;" class="text-muted">' + results["attributionText"] + '</small>' +
                                // '</div>' +
                            '</div>';
                    }
                }

                output += '</div>';

                comicSection.innerHTML = output;
            }


        } else {
            console.log('Error onload function.');
        }
    }

    xhr.onloadend = function() {
        document.getElementById('comicsSpinnerSection')
            .innerHTML = '<strong id="spinnerText" class="text-success">Done.</strong>';
    }

    xhr.onerror = function () {
        console.log('Error onerror function.');
    }

    xhr.send();
}

function singleComic() {
    var urlQueryParameters = new URLSearchParams(window.location.search),
        comicID = urlQueryParameters.get('comic-id');

    var xhr = new XMLHttpRequest();

    xhr.open('GET', '/connections/single-comic.php?comic-id=' + comicID, true);
    xhr.onloadstart = function() {
        document.getElementById('comicsSpinnerSection')
                .innerHTML =
                '<strong id="spinnerText" class="text-secondary">Loading comic info...</strong>' +
                '<div class="spinner-border text-secondary ml-auto" role="status" ' +
                'aria-hidden="true" id="spinner"></div>';
    }
    xhr.onload = function() {
        if (this.status == 200) {
            var results = JSON.parse(this.responseText);
                comicInfo = results["data"].results[0],
                comicImage = comicInfo.thumbnail["path"] + '.' + comicInfo.thumbnail["extension"],
                comicDescription = comicInfo.description,
                comicCharacters = comicInfo.characters.items,
                comicCreators = comicInfo.creators.items,
                output = '',
                singleComicContainerDiv = document.getElementById('singleComicContainerDiv');
            
            output += '<h1 class="header-main-title single-comic__main-title">' + comicInfo.title + '</h1>' +
            '<div class="card mb-3">' +
                '<div class="row no-gutters">' +
                    '<div class="col-md-4">' +
                        '<img src="' + comicImage + '" class="card-img" alt="...">' +
                    '</div>' +
                    '<div class="col-md-8">' +
                        '<div class="card-body">' +
                            '<h5 class="card-title">' + comicInfo.title + '</h5>';

                            if (comicDescription !== null && comicDescription !== '') {
                                output +='<p class="card-text">' + comicDescription + '</p>';
                            }
                            
                            output += '<p class="card-text">'+
                                '<small class="text-muted">' +
                                ' Characters: ';
                                for (const i in comicCharacters) {
                                    if (comicCharacters.hasOwnProperty(i)) {
                                        const character = comicCharacters[i];
                                        output += '<a href="/index.php?name=' + character.name + '">' + character.name + '</a>, ';
                                    }
                                }
                                
            output +=           '</small>' +
                            '</p>' +
                            '<p class="card-text">' +
                                '<small class="text-muted">' +
                                'Creators: ';
                                for (const i in comicCreators) {
                                    if (comicCreators.hasOwnProperty(i)) {
                                        const creator = comicCreators[i];
                                        output+= 
                                        '<a href="/creator.php?resource-URI=' + 
                                        creator.resourceURI + '">' + 
                                        creator.name.concat(' (' + creator.role + '), ') + 
                                        '</a>, ';
                                    }
                                }
                            
            output +=            '</small>' +
                            '</p>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="card-footer text-muted text-right"> ' +
                    results["attributionText"] +
                '</div>' +
            '</div>';

            singleComicContainerDiv.innerHTML = output;
        }
        else {
            console.log('Error from onload Function...');
        }
    }
    xhr.onloadend = function() {
        document.getElementById('comicsSpinnerSection')
                .innerHTML =
                '<strong id="spinnerText" class="text-secondary">Done.</strong>';
    }
    xhr.onerror = function() {
        console.log('Error from onerror function...');
    }
    xhr.send();
}

function comicCreator() {
    var urlQueryParameters = new URLSearchParams(window.location.search),
        creatorURI = urlQueryParameters.get('resource-URI'),
        url = new URL(creatorURI),
        creatorID = url.pathname.substring(url.pathname.lastIndexOf('/') + 1),
        xhr = new XMLHttpRequest();
        
        xhr.open('GET', '/connections/creator.php?creator-id=' + creatorID, true);

        xhr.onloadstart = function() {
            document.getElementById('comicCreatorSpinnerSection')
                    .innerHTML = 
                    '<strong id="spinnerText" class="text-secondary">Loading comic info...</strong>' +
                    '<div class="spinner-border text-secondary ml-auto" role="status" ' +
                    'aria-hidden="true" id="spinner"></div>';
        }
       
        xhr.onload = function() {
            if(this.status === 200) {
                var results = JSON.parse(this.responseText),
                    output = '',
                    creatorInfo = results["data"].results[0],
                    creatorFullName = creatorInfo.fullName,
                    creatorImage = creatorInfo.thumbnail["path"] + '.' + creatorInfo.thumbnail["extension"],
                    comicCreatorContainerDiv = document.getElementById('comicCreatorContainerDiv'),
                    creatorComics = creatorInfo.comics.items;
                    // creatorDescription = creatorInfo.description,
                    // creatorCharacters = creatorInfo.characters.items,
                    // creatorCreators = creatorInfo.creators.items;

                console.log(creatorInfo);
                // console.log(creatorFullName);
                // console.log(creatorImage);
                // console.log(creatorComics);
                
                output += 
                    '<h1 class="header-main-title single-comic__main-title">' + creatorFullName + '</h1>' +
                    '<div class="card mb-3">' +
                        '<div class="row no-gutters">' +
                            '<div class="col-md-4">' +
                                '<img src="' + creatorImage + '" class="card-img" alt="...">' +
                            '</div>' + // end col-md-4
                            '<div class="col-md-8">' +
                                '<div class="card-body">' +
                                    '<h5 class="card-title">' + creatorFullName + '</h5>';

                output +=           '<p class="text-muted mb-3">' +
                                        'Comics: ' + creatorInfo.comics["available"] + ' | ' +
                                        'Series: ' + creatorInfo.series["available"] + ' | ' +
                                        'Stories: ' + creatorInfo.stories["available"] + ' | ' +
                                        'Events: ' + creatorInfo.events["available"] +
                                    '</p>';


                    output +=   '</div>' + // Card Body
                            '</div>' + // col-md-8
                        '</div>' + // row
                        '<div class="card-footer text-muted text-right"> ' +
                            results["attributionText"] +
                        '</div>' +
                    '</div>'; // card

                    output +=
                    '<h1 class="header-main-title single-comic__main-title">Comics</h1>' +
                    '<div class="row" id="comicColumns"></div>';

                    comicCreatorContainerDiv.innerHTML = output;

                    var comicColumns = document.getElementById('comicColumns');
                    //     comicParagraph = document.createElement('p');

                    for (const i in creatorComics) {
                        if (creatorComics.hasOwnProperty(i)) {
                            const comic = creatorComics[i];
                            // console.log(singleComic(comic.resourceURI));
                            creatorSingleComic(comic.resourceURI);
                            // output += '<div class="col-md-4" >' + singleComic(comic.resourceURI) + '</div>';
                        }
                    }

            } else {
                console.log('onload function error...' + this.responseText);
            }
        }
        
        xhr.onloadend = function() {
            document.getElementById('comicCreatorSpinnerSection')
                    .innerHTML = '<strong id="spinnerText" class="text-secondary">Done.</strong>';
        }
        
        xhr.onerror = function() {
            console.log("onerror method error..." + this.responseText);
        }
        
        xhr.send();

}

function creatorSingleComic(comicResourceURI) {
    var url = new URL(comicResourceURI),
        comicID = url.pathname.substring(url.pathname.lastIndexOf('/') + 1),
        // output = '',
        xhr = new XMLHttpRequest();

        xhr.open('GET', '/connections/single-comic.php?comic-id=' + comicID, true);
        
        xhr.onloadstart = function() {
            // console.log('onloadstart...');
        }
        
        xhr.onload = function() {
            if(this.status === 200) {
                var results = JSON.parse(this.responseText),
                    comicInfo = results["data"].results[0],
                    comicImage = comicInfo.thumbnail["path"] + '.' + comicInfo.thumbnail["extension"],
                    comicTitle = comicInfo.title,
                    output = '',
                    comicColumns = document.getElementById('comicColumns');
                    output =
                    '<div class="col-md-4" >' +
                        '<div class="card mb-3">' +
                            '<a href="/comic.php?comic-id=' + comicInfo.id + '">' +
                            '<img src="' + comicImage + '" class="card-img-top" alt="' + comicTitle + '">' +
                            '</a>' +
                            '<div class="card-body">' +
                                '<h5 class="card-title">' + comicTitle + '</h5>';
                                
                                if (comicInfo.description !== '') {
                                    output +=
                                    '<p class="card-text"><small class="text-muted">' +
                                    comicInfo.description +
                                    '</small></p>';
                                }
                                output +=
                                '<a href="/comic.php?comic-id=' + comicInfo.id + '">Check it out!</a>' +
                            '</div>' +
                        '</div>' +
                    '</div>';

                    comicColumns.innerHTML += output;
                
            } else {
                console.log('onload error...');
            }
        }
        
        xhr.onloaderror = function() {
            console.log('onloaderror...');
        }
        
        xhr.onloadend = function() {
            // console.log('onloadend...');
        }
        
        xhr.send();
    
}