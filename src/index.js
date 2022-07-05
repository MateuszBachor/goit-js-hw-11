
import Notiflix from 'notiflix';
import { fetchImages } from './js/fetchImages';

async function fetchImages(name, page, perPage) {


  try {
    const { data } = await axios.get(
      `https://pixabay.com/api?key=28406091-8008b7c1afae3beb3d4e940a7&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
    );
    return data;
  } catch (error) {
    console.log('ERROR: ' + error);
  }
}

const searchQuery = document.querySelector('input[name="searchQuery"]');
const clsBtn = document.querySelector('.close-btn');
clsBtn.style.display="none";
const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
loadMoreBtn.style.display = "none"
let perPage = 40;
let page = 0;
let name = searchQuery.value;


 function eventHandler(e) {
  e.preventDefault();
  gallery.innerHTML = '';
  page = 1;
  name = searchQuery.value;

  fetchImages(name, page, perPage)
    .then(name => {
      let pages = name.totalHits / perPage;

      if (name.hits.length > 0) {
        showGallery(name);
        clsBtn.style.display = 'block';
        clsBtn.addEventListener('click', () => {
          gallery.innerHTML = '';
          clsBtn.style.display = 'none';
          loadMoreBtn.style.display = "none"
          page = 0;
        });

        if (page < pages) {
          loadMoreBtn.style.display = 'block';
        } else {
          loadMoreBtn.style.display = 'none';
          Notiflix.Notify.info(
            "We're sorry, but you've reached the end of search results."
          );
        }
      } else {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        gallery.innerHTML = '';
      }
    })
    .catch(error => console.log('ERROR: ' + error));
}

searchForm.addEventListener('submit', eventHandler);
function showGallery(name) {
  const markup = name.hits
    .map(hit => {
      return `<div class="photo-card">
      <img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" />
      <div class="info">
        <p class="info-item"><b>Likes: ${hit.likes}</b></p>
        <p class="info-item"><b>Views: ${hit.views}</b></p>
        <p class="info-item"><b>Comments: ${hit.comments}</b></p>
        <p class="info-item"><b>Downloads: ${hit.downloads}</b></p>
      </div>
    </div>
    `
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
}

loadMoreBtn.addEventListener('click',() => {
    name = searchQuery.value;
    page ++;
    fetchImages(name, page, perPage).then(name => {
      let pages = name.totalHits / perPage;
      showGallery(name);
      if (page >= pages) {
        loadMoreBtn.style.display = 'none';
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
    });
  },
  true
);
