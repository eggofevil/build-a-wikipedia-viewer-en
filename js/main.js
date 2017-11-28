// запретить запрос с пустой строкой поиска.
// поискать возможность отправки поискового запроса по нажатию на enter.
// посмотреть запрос рандомной статьи на предмет категорий статей.
// глянуть есть ли возможность запускать поиск с одной кнопки.
// может, добавить возможность запроса к другим версиям вики.
// может, добавить русскоязычную версию страницы.

var baseUrl,
  rndBtn = document.querySelector('#rndArtBtn'),
  searchBtn = document.querySelector('#searchBtn'),
  searchInp = document.querySelector('#searchInp'),
  searchResults = document.querySelector('#searchResults'),
  controls = document.querySelector('#controls'),
  article = document.querySelector('article'),
  returnBtnTop = document.querySelector('#returnBtnTop'),
  returnBtnBottom = document.querySelector('#returnBtnBottom'),
  msgBox = document.querySelector('#msgBox'),
  msgCloseBtn = document.querySelector('#msgCloseBtn');

function buildUrl(id) {
  'use strict';
  while (searchResults.firstChild) {
    searchResults.removeChild(searchResults.firstChild);
  }
  baseUrl = 'https://en.wikipedia.org/w/api.php?origin=*&format=json&action=query';
  switch (id) {
  case 'rndArtBtn':
    baseUrl += '&generator=random&grnlimit=1&grnnamespace=0&prop=info|extracts&inprop=url&exintro=1&explaintext=1';
    break;
  case 'searchBtn':
    baseUrl += '&uselang=user&list=search&srnamespace=0&srinterwiki=1&srprop=snippet&srsearch=' + searchInp.value;
    break;
  default:
    baseUrl += '&uselang=user&pageids=' + id + '&prop=info|extracts&inprop=url&exintro=1&explaintext=1&exsentences=1';
  }
  getArt(encodeURI(baseUrl), id);
}

function getArt(url, id) {
  'use strict';
  var request = new XMLHttpRequest();
  request.open('GET', url);
  request.setRequestHeader('Api-User-Agent', 'Wikipedia searcher test application (https://eggofevil.github.io/build-wikipedia-viewer/; nucleusofgood@gmail.com)');
  request.responseType = 'json';
  request.addEventListener('load', function (e) {
    if (request.status === 200) {
      if (typeof (request.response) === 'string') { ///for IE11 compatability
        responseAction(JSON.parse(request.response), id);
      } else {
        responseAction(request.response, id);
      }
    } else {
      console.log(e);
    }
  });
  request.send();
}

function responseAction(response, id) {
  'use strict';
  if (id === 'searchBtn') {
    response.query.search.forEach(function (el) {
      buildUrl(el.pageid);
    });
  } else {
    var key = Object.keys(response.query.pages)[0],
      resultDiv = document.createElement('div'),
      titleHead = document.createElement('h3'),
      extractsPara = document.createElement('p');
    resultDiv.setAttribute('tabindex', 0);
    resultDiv.addEventListener('click', function () {
      window.open(response.query.pages[key].canonicalurl, '_blank');
    });
    titleHead.textContent = response.query.pages[key].title;
    extractsPara.textContent = response.query.pages[key].extract;
    searchResults.appendChild(resultDiv);
    resultDiv.appendChild(titleHead);
    resultDiv.appendChild(extractsPara);
  }
}

rndBtn.addEventListener('click', function () {
  'use strict';
  buildUrl(this.id);
  if (returnBtnTop.classList.toString().indexOf('hidden') === -1) {
    returnBtnTop.className += ' hidden';
  }
  if (returnBtnBottom.classList.toString().indexOf('hidden') === -1) {
    returnBtnBottom.className += ' hidden';
  }
});
searchBtn.addEventListener('click', function () {
  'use strict';
  if (searchInp.value === '') {
    msgBox.classList.remove('hidden');
    return null;
  }
  if (msgBox.classList.toString().indexOf('hidden') === -1) {
    msgBox.className += ' hidden';
  }
  buildUrl(this.id);
  controls.className += ' hidden';
  returnBtnTop.classList.remove('hidden');
  returnBtnBottom.classList.remove('hidden');
});
msgCloseBtn.addEventListener('click', function () {
  'use strict';
  if (msgBox.classList.toString().indexOf('hidden') === -1) {
    msgBox.className += ' hidden';
  }
});
returnBtnTop.addEventListener('click', function () {
  'use strict';
  if (returnBtnTop.classList.toString().indexOf('hidden') === -1) {
    returnBtnTop.className += ' hidden';
  }
  controls.classList.remove('hidden');
});
returnBtnBottom.addEventListener('click', function () {
  'use strict';
  if (returnBtnTop.classList.toString().indexOf('hidden') === -1) {
    returnBtnTop.className += ' hidden';
  }
  controls.classList.remove('hidden');
  window.scrollTo(0, 0);
});
