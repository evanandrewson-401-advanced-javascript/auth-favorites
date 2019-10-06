const request = require('../request');
const { dropCollection } = require('../db');
const jwt = require('jsonwebtoken');
require('dotenv').config();
require('../../lib/models/register-plugins');
const User = require('../../lib/models/user');

describe('Auth API', () => {
  beforeEach(() => dropCollection('users'));

  const testUser = {
    email: 'me@me.com',
    password: 'abc'
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

  it('signs up a user', () => {
    expect(user.token).toBeDefined();
  });

  it('cannot sign up with same email', () => {
    return request
      .post('/api/auth/signup')
      .send(testUser)
      .expect(400)
      .then(({ body }) => {
        expect(body.error).toBe('Email me@me.com already in use');
      });
  });

  function testEmailAndPasswordRequired(route, testProperty, user) {
    it(`${route} requires ${testProperty}`, () => {
      return request
        .post(`/api/auth/${route}`)
        .send(user)
        .expect(400)
        .then(({ body }) => {
          expect(body.error).toBe('Email and password required');
        });
    });
  }

  testEmailAndPasswordRequired('signup', 'email', {
    password: 'I no like emails'
  });
  testEmailAndPasswordRequired('signup', 'password', {
    email: 'no@password.com'
  });
  testEmailAndPasswordRequired('signin', 'email', {
    password: 'I no like emails'
  });
  testEmailAndPasswordRequired('signin', 'password', {
    email: 'no@password.com'
  });

  it('signs in a user', () => {
    return request
      .post('/api/auth/signin')
      .send(testUser)
      .expect(200)
      .then(({ body }) => {
        expect(body.token).toBeDefined();
      });
  });

  function testBadSignup(testName, user) {
    it(testName, () => {
      return request
        .post('/api/auth/signin')
        .send(user)
        .expect(401)
        .then(({ body }) => {
          expect(body.error).toBe('Invalid email or password');
        });
    });
  }

  testBadSignup('rejects bad password', {
    email: testUser.email,
    password: 'bad password'
  });

  testBadSignup('rejects invalid email', {
    email: 'bad@email.com',
    password: testUser.password
  });

  it('verifies a good token', () => {
    return request
      .get('/api/auth/verify')
      .set('Authorization', user.token)
      .expect(200);
  });

  it('verifies a bad token', () => {
    return request
      .get('/api/auth/verify')
      .set('Authorization', jwt.sign({ foo: 'bar' }, 'shhhhh'))
      .expect(401);
  });

  it('allows an admin to change roles', () => {
    return request
      .post('/api/auth/signup')
      .send({ email: 'new@new.com', password: '123' })
      .expect(200)
      .then(({ body }) => {
        return request
          .put(`/api/auth/users/${body._id}/roles/admin`)
          .set('Authorization', user.token)
          .expect(200)
          .then(result => {
            expect(result.body).toMatchInlineSnapshot(
              {
                _id: expect.any(String),
                hash: expect.any(String)
              },
              `
                Object {
                  "__v": 0,
                  "_id": Any<String>,
                  "email": "new@new.com",
                  "favorites": Array [],
                  "hash": Any<String>,
                  "roles": Array [],
                }
              `
            );
          });
      });
  });
  it('allows an admin to delete roles', () => {
    return request
      .post('/api/auth/signup')
      .send({ email: 'new@new.com', password: '123' })
      .expect(200)
      .then(({ body }) => {
        return request
          .put(`/api/auth/users/${body._id}/roles/admin`)
          .set('Authorization', user.token)
          .expect(200)
          .then(result => {
            return request
              .delete(`/api/auth/users/${body._id}/roles/admin`)
              .set('Authorization', user.token)
              .expect(200);
          })
          .then(finalResult => {
            console.log(finalResult.body);
            expect(finalResult.body).toMatchInlineSnapshot(
              {
                _id: expect.any(String),
                hash: expect.any(String)
              },
              `
              Object {
                "__v": 0,
                "_id": Any<String>,
                "email": "new@new.com",
                "favorites": Array [],
                "hash": Any<String>,
                "roles": Array [
                  "admin",
                ],
              }
            `
            );
          });
      });
  });
  it('gets all users and their roles', () => {
    return request
      .get('/api/auth/users/')
      .set('Authorization', user.token)
      .expect(200)
      .then(({ body }) => {
        expect(body).toMatchInlineSnapshot(
          [
            {
              _id: expect.any(String)
            }
          ],
          `
          Object {
            "0": Object {
              "_id": "5d9a67313dcd4d445d7a657e",
              "email": "me@me.com",
              "roles": Array [
                "admin",
              ],
            },
          }
        `
        );
      });
  });
});
