/* eslint-disable no-use-before-define */
const express = require('express');
const bodyParser = require('body-parser');

const axios = require('axios');

const port = 3000;
const app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get('/', (req, res) => res.send('Welcome to  Hatchway Backend App!'));

app.get('/api/ping', (req, res) => {
  res.status(200);
  res.send({ success: true });
});

app.get('/api/posts', (req, res) => {
  const tags = req.query.tags.split(',');
  let sortBy = 'id';
  let direction = 'asc';

  if (req.query.tags === undefined) {
    res.status(400);
    res.send({ error: 'Tags parameter is required' });
  }

  if (req.query.sortBy !== undefined) {
    sortBy = req.query.sortBy;
  }
  if (req.query.direction !== undefined) {
    direction = req.query.direction;
  }

  getAllTagsPost(tags, (err, data) => {
    if (err) {
      res.status(400);
      res.send({ error: 'Tags parameter is not valid' });
    }
    // const sortedPosts = sortPosts(sortBy, direction, data);
    if (data[0][sortBy] === undefined) {
      res.status(400);
      res.send({ error: 'sortBy parameter is invalid' });
    }
    data.sort(sortPosts(sortBy, direction));

    res.json({ posts: data });
  });
});

const getAllTagsPost = (tags, callback) => {
  // guarrantee unique posts
  const existingPost = {};
  const promises = [];

  for (let i = 0; i < tags.length; i += 1) {
    const promise = new Promise((resolve, reject) => {
      axios.get(`https://hatchways.io/api/assessment/blog/posts?tag=${tags[i]}`).then((response) => {
        // console.log(response);
        const { posts } = response.data;
        const list = [];
        for (let x = 0; x < posts.length; x += 1) {
          const post = posts[x];

          if (existingPost[post.id] === undefined) {
            existingPost[post.id] = 1;
            list.push(post);
          }
        }
        resolve(list);
      }).catch((error) => {
        reject(error);
      });
    });
    promises.push(promise);
  }
  Promise.all(promises).then((result) => {
    const mergedResult = [].concat(...result);
    callback(null, mergedResult);
  }).catch((error) => {
    callback(error, null);
  });
};

const sortPosts = (key, order) => function (a, b) {
  if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
    return 0;
  }

  const varA = (typeof a[key] === 'string') ? a[key].toUpperCase() : a[key];
  const varB = (typeof b[key] === 'string') ? b[key].toUpperCase() : b[key];

  let comparison = 0;
  if (varA > varB) {
    comparison = 1;
  } else if (varA < varB) {
    comparison = -1;
  }
  return (
    (order == 'desc') ? (comparison * -1) : comparison
  );
};
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
