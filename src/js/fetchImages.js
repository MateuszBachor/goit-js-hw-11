
import axios from 'axios';
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
  export { fetchImages };