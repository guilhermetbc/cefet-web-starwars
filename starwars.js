// Seu javascript aqui :)
// Use a Star Wars API: https://swapi.co/
// para carregar:
//  - A lista de filmes
//  - A introdução de cada filme, quando ele for clicado

const getRomanNumber = function(number) {
  switch(number){
    case 1: return 'I';
    case 2: return 'II';
    case 3: return 'III';
    case 4: return 'IV';
    case 5: return 'V';
    case 6: return 'VI';
    case 7: return 'VII';
    default: return null;
  }
}

const fillFilmList = function(){
  const response = JSON.parse(this.response);
  const films = response.results;

  films.sort(function(current, next){
    if(current.episode_id < next.episode_id) {
      return -1;
    } else if(current.episode_id > next.episode_id) {
      return 1;
    }
    return 0;
  });
  for(const film of films) {
    let filmListItem = document.createElement('li');
    filmListItem.dataset.episodeUrl = film.url;
    filmListItem.innerHTML = `Episode ${getRomanNumber(film.episode_id)}`;
    filmElementsList.appendChild(filmListItem);
  }
  const loadingLi = document.querySelector('#loading');
  filmElementsList.removeChild(loadingLi);

  addClickEventToList();
}

const getFilms = function(){
  const filmsListRequest = new XMLHttpRequest();
  filmsListRequest.addEventListener('load', fillFilmList);
  filmsListRequest.open('GET', 'https://swapi.co/api/films/');
  filmsListRequest.send(null);
}

const changeOpeningCrawl = function(e){
  const response = JSON.parse(this.response);
  openingCrawlContainer = document.querySelector('.reading-animation');
  openingCrawlContainer.innerHTML =
  `
  Episode ${getRomanNumber(response.episode_id)}
  ${response.title.toUpperCase()}
  ${response.opening_crawl}
  `;
}

const makeOpeningCrawlRequest = function(episodeUrl){
  const crawlRequest = new XMLHttpRequest();
  crawlRequest.addEventListener('load', changeOpeningCrawl);
  crawlRequest.open('GET', episodeUrl);
  crawlRequest.send(null)
  localStorage.setItem('lastClickedMovieUrl', episodeUrl);
}

const addClickEventToList = function(){
  filmsListItems = document.querySelectorAll('nav ul li');
  for(const listItem of filmsListItems){
   listItem.addEventListener('click', function(){
     makeOpeningCrawlRequest(listItem.dataset.episodeUrl)
   })
  }
}

const getLastMovieClicked = function(){
  const lastMovieUrl = localStorage.getItem('lastClickedMovieUrl');
  makeOpeningCrawlRequest(lastMovieUrl);
}

const filmElementsList = document.querySelector('ul');
getFilms();

getLastMovieClicked(localStorage);