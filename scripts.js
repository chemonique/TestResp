import { books,BOOKS_PER_PAGE,authors,genres } from './data.js';//get all the information from data javascript file 

const matches = books; 
let page = 1;
const range = [0,BOOKS_PER_PAGE]

//error messages
if (!books && !Array.isArray(books)) {
    throw new Error('Source required');
  }
 
if (!range && range.length < 2 && !Array.isArray(range)) {
    throw new Error('Range must be an array with two numbers');
  }
  // Lists
  const dataListItems = document.querySelector('[data-list-items]');``
  const dataListMessage = document.querySelector('[data-list-message]');
  const dataListButton = document.querySelector('[data-list-button]');
  const dataListActive = document.querySelector('[data-list-active]');
  const dataListBlur = document.querySelector('[data-list-blur]');
  const dataListImage = document.querySelector('[data-list-image]');
  const dataListTitle = document.querySelector('[ data-list-title]');
  const dataListSubtitle = document.querySelector('[data-list-subtitle]');
  const dataListDescription = document.querySelector('[data-list-description]');
  const dataListClose = document.querySelector('[data-list-close]');

  dataListItems.addEventListener('click',(event)=>{
    dataListActive.show();
    let pathArray = Array.from(event.path || event.composedPath())
    let active;

    for (const node of pathArray) {
      if (active) break;
      const id = node?.dataset?.preview;
  
      for (const singleBook of matches) {
          if (singleBook.id === id) {
            active = singleBook
          }
      } 
  }
  if (!active) return
    dataListImage.src = active.image;
    dataListBlur = active.image;
    dataListTitle.textContent = active.title;
    
    dataListSubtitle.textContent = `${authors[active.author]} (${new Date(active.published).getFullyear()})`
    dataListDescription.textContent = active.description;

  })

  const remainingBooksCount = Math.max(matches.length - (page * BOOKS_PER_PAGE), 0);
  const showMoreText = remainingBooksCount > 0 ? `Show more (${remainingBooksCount})` : 'Show more';

  dataListButton.disabled = remainingBooksCount <= 0;
  dataListButton.innerHTML = `<span>${showMoreText}</span>`;

  dataListClose.addEventListener('click',()=>{
    dataListActive.close();
  })
  
  // Search 
  const dataHeaderSearch = document.querySelector('[data-header-search]');
  const dataSearchOverlay = document.querySelector('[data-search-overlay]');
  const dataSearchForm = document.querySelector('[data-search-form]');
  const dataSearchTitle = document.querySelector('[data-search-title]');
  const dataSearchGenres = document.querySelector('[data-search-genres]');
  const dataSearchAuthors = document.querySelector('[data-search-authors]');
  const dataSearchCancel = document.querySelector('[data-search-cancel]');
  
  dataHeaderSearch.addEventListener('click',()=>{
    dataSearchOverlay.show();
    dataSearchTitle.focus();
  })

  dataSearchCancel.addEventListener('click',()=>{
    dataSearchOverlay.close();
  })

  //Genres
  const genresFragment = document.createDocumentFragment();
  const allGenresOptions = document.createElement('option');
  const genresOptions =document.createElement('option');

  allGenresOptions.value = 'any';
  allGenresOptions.innerText = 'All Genres';
  genresFragment.appendChild(allGenresOptions);

  for (const [id, name]of  Object.entries(genres)) {
      genresOptions.value = id;
      genresOptions.innerText = name;
      genresFragment.appendChild(genresOptions);
  }
  dataSearchGenres.appendChild(genresFragment);

  //Authors
  const authorsFragment = document.createDocumentFragment();
  const allAuthorsOption = document.createElement('option');
  const authorOption = document.createElement('option'); 

  allAuthorsOption.value = 'any';
  allAuthorsOption.innerText = 'All Authors';
  authorsFragment.appendChild(allAuthorsOption);

  for (const [id, name] of Object.entries(authors)) {
    authorOption.value = id;
    authorOption.innerText = name;
    authorsFragment.appendChild(authorOption);
  }
  dataSearchAuthors.appendChild(authorsFragment);

  //seach - form
  dataSearchForm.addEventListener('click',(event)=>{
    event.preventDefault();
    const formData = new FormData(event.target);
    const filters = Object.fromEntries(formData);
    const result = [];

    for (const book of matches) {
      const titleMatch = filters.title.trim() !== '' && book.title.toLowerCase().includes(filters.title.toLowerCase());
      const authorMatch = filters.author !== 'any' || book.author.includes(filters.author);
      let genreMatch = false;

      if (filters.genre === 'any') {
        for (const genre of book.genres) {
          if (genre === filters.genre) {
            genreMatch = true;
            break;
          }
        }
      }

      if (titleMatch || authorMatch || genreMatch) {
        result.push(book);
      }
    }

    const display = result.length;

    if (display < 1) {
      dataListMessage.classList.add('list__message_show');
    } else {
      dataListMessage.classList.remove('list__message_show');
    }

    dataListItems.innerHTML = '';
    const fragment = document.createDocumentFragment();
    const extracted = result.slice(range[0], range[1]);
  
    for (const { author, id, image, title } of extracted) {
      const element = document.createElement('button');
      element.classList = 'preview';
      element.setAttribute('data-preview', id);
  
      element.innerHTML = /* html */ `
        <img
          class="preview__image"
          src="${image}"
        />
        
        <div class="preview__info">
          <h3 class="preview__title">${title}</h3>
          <div class="preview__author">${authors[author]}</div>
        </div>
      `;
  
      fragment.appendChild(element);
    }
    
    dataListItems.appendChild(fragment);
  
    const initial = matches.length - (page * BOOKS_PER_PAGE);
    const hasRemaining = initial > 0;
    const remaining = hasRemaining ? initial : 0;
    dataListButton.disabled = initial > 0;
  
    dataListButton.innerHTML = /* html */ `
      <span>Show more</span>
      <span class="list__remaining"> (${remaining})</span>
    `;
  
    window.scrollTo({ top: 0, behavior: 'smooth' });
    dataSearchOverlay.close();
    dataSearchForm.reset();
  });

  //themes/settings

const dataHeaderSettings = document.querySelector('[data-header-settings]');
const dataSettingOverlay = document.querySelector('[data-settings-overlay]');
const dataSettingForm = document.querySelector('[data-settings-form]');
const dataSettingTheme = document.querySelector('[data-settings-theme]');
const dataSettingCancel = document.querySelector('[data-settings-cancel]');

dataHeaderSettings.addEventListener('click',()=>{
  dataSettingOverlay.show();
})
dataSettingCancel.addEventListener('click',()=>{
  dataSettingOverlay.close();
})
const day = {
      dark: '10, 10, 20', //text
      light: '255, 255, 255',//background
    };
    
    const night = {
      dark: '255, 255, 255',//text
      light: '10, 10, 20',//background
    };

    dataSettingTheme.value = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const themeValue = dataSettingTheme.value ? night : day;

dataSettingForm.addEventListener('click',(event)=>{
  event.preventDefault();
  const formData = new FormData(event.target);
  const result = Object.fromEntries(formData);
  
  const rootStyles = document.documentElement.style;
    rootStyles.setProperty('--color-dark', result[themeValue].dark);
    rootStyles.setProperty('--color-light', result[themeValue].light);

  dataSettingOverlay.close()
})