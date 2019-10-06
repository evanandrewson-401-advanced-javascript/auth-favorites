const request = require('../request');
const { dropCollection } = require('../db');
const jwt = require('jsonwebtoken');
require('dotenv').config();
require('../../lib/models/register-plugins');
const User = require('../../lib/models/user');

describe('Pirates API', () => {
  beforeEach(() => dropCollection('users'));
  beforeEach(() => dropCollection('pirates'));

  const testUser = {
    email: 'me@me.com',
    password: 'abc'
  };

  const blackbeard = {
    name: 'Blackbeard'
  };

  const postPirate = pirate => {
    return request
      .post('/api/pirates')
      .set('Authorization', user.token)
      .send(pirate);
  };

  let user = null;

  beforeEach(() => {
    return request
      .post('/api/auth/signup')
      .send(testUser)
      .expect(200)
      .then(({ body }) => {
        return User.updateById(body._id, {
          $addToSet: {
            roles: 'admin'
          }
        })
          .then(updateUser => {
            return request
              .post('/api/auth/signin')
              .send(testUser)
              .expect(200);
          })
          .then(({ body }) => {
            user = body;
          });
      });
  });

  it('admin can post pirates', () => {
    return postPirate(blackbeard).then(({ body }) => {
      expect(body).toMatchInlineSnapshot(
        {
          _id: expect.any(String)
        },
        `
        Object {
          "__v": 0,
          "_id": Any<String>,
          "name": "Blackbeard",
        }
      `
      );
    });
  });

  it('admin can update pirates', () => {
    return postPirate(blackbeard).then(({ body }) => {
      return request
        .put(`/api/pirates/${body._id}`)
        .set('Authorization', user.token)
        .send({ name: 'Bluebeard' })
        .expect(200)
        .then(({ body }) => {
          expect(body.name).toBe('Bluebeard');
        });
    });
  });

  it('admin can delete pirates', () => {
    return postPirate(blackbeard).then(({ body }) => {
      return request
        .delete(`/api/pirates/${body._id}`)
        .set('Authorization', user.token)
        .expect(200);
    });
  });

  it('any user can get all pirates', () => {
    return Promise.all([
      postPirate(blackbeard),
      postPirate(blackbeard),
      postPirate(blackbeard)
    ]).then(() => {
      return request
        .get('/api/pirates')
        .set('Authorization', user.token)
        .expect(200)
        .then(({ body }) => {
          expect(body.length).toBe(3);
          expect(body[0]).toMatchInlineSnapshot(
            {
              _id: expect.any(String)
            },
            `
            Object {
              "__v": 0,
              "_id": Any<String>,
              "name": "Blackbeard",
            }
          `
          );
        });
    });
  });
});
