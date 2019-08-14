/* eslint-disable func-names */
/* eslint-disable no-use-before-define */
const express = require('express');
const bodyParser = require('body-parser');

const axios = require('axios');

const port = 3000;
const app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get('/', (req, res) => res.send('Welcome to Backend App!'));

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

  const directions = ['asc', 'desc'];
  if (req.query.direction && !directions.includes(req.query.direction)) {
    res.status(400);
    res.send({ error: 'direction parameter is invalid' });
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
    if (data[0][sortBy] === undefined) {
      res.status(400);
      res.send({ error: 'sortBy parameter is invalid' });
    }
    data.sort(sortPosts(sortBy, direction));

    res.json({ posts: data });
  });
});

const getAllTagsPost = (tags, callback) => {
  const existingPost = {};
  const promises = [];

  for (let i = 0; i < tags.length; i += 1) {
    const promise = new Promise((resolve, reject) => {
      axios.get(`https://hatchways.io/api/assessment/blog/posts?tag=${tags[i]}`).then((response) => {
        const { posts } = response.data;
        const list = [];
        for (let x = 0; x < posts.length; x += 1) {
          const post = posts[x];

          if (existingPost[post.id] === undefined) {
            existingPost[post.id] = 1;
            list.push(post);
          }
        }
        if (list.length === 0) {
          reject(new Error(`Invalid tag parameter ${tags[i]}`));
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

  const valA = (typeof a[key] === 'string') ? a[key].toUpperCase() : a[key];
  const valB = (typeof b[key] === 'string') ? b[key].toUpperCase() : b[key];

  let comparison = 0;

  if (valA > valB) {
    comparison = 1;
  } else if (valA < valB) {
    comparison = -1;
  }
  return (
    (order === 'desc') ? (comparison * -1) : comparison
  );
};

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
