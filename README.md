# YelpCamp

My YelpCamp implementation from  [Colt Steele's Udemy course](https://www.udemy.com/course/the-web-developer-bootcamp/).

YelpCamp is a full CRUD website with authentication and authorization built with the MongoDB, Express, EJS, and NodeJS stack. Notable other technologies it uses are [Cloudinary](https://cloudinary.com/) for image hosting and processing and [Mapbox](https://www.mapbox.com/) for the interactive maps. YelpCamp is a Yelp clone which lets registered users submit campgrounds and leave reviews on others' campgrounds.

The live version of the site is currently hosted on herouku. [Click here to visit it](https://mc-my-yelpcamp.herokuapp.com/). I added some additional features from where the course left off, most notably the profile pages. 

Further development is tentatively on hold (except for squashing bad bugs) as I have started to branch out and learn other technologies and start new projects.

To run a local build of this YelpCamp, you will need a .env file with the following keys:
`CLOUDINARY_CLOUD_NAME`
`CLOUDINARY_KEY`
`CLOUDINARY_SECRET`
`MAPBOX_TOKEN`
`DB_URL`
Clone this repository and run `npm install` for the required packages. Run `node index.js` to start the server (default port is 3000).
