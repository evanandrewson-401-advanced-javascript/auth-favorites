const request = require('../request');
const { dropCollection } = require('../db');
const { signupUser } = require('../data-helpers');

describe('me API', () => {
  beforeEach(() => dropCollection('users'));
  beforeEach(() => dropCollection('crystals'));

  let user = null;
  beforeEach(() => {
    return signupUser().then(newUser => (user = newUser));
  });

  const crystal = {
    name: 'Amethyst',
    description: 'purple and amazing',
    price: 5.0,
    category: 'quartz'
  };

  it('adds a crystal to favorites', () => {
    return request
      .post('/api/crystals')
      .set('Authorization', user.token)
      .send(crystal)
      .then(({ body }) => {
        return request
          .put(`/api/me/favorites/${body._id}`)
          .set('Authorization', user.token)
          .expect(200)
          .then(result => {
            expect(result.body).toEqual([body._id])
          });
      });
  });

  it('deletes a crystal from favorites', () => {
    return request
      .post('/api/crystals')
      .set('Authorization', user.token)
      .send(crystal)
      .then(({ body }) => {
        return request
          .put(`/api/me/favorites/${body._id}`)
          .set('Authorization', user.token)
          .expect(200)
          .then(result => {
            return request
              .delete(`/api/me/favorites/${body._id}`)
              .set('Authorization', user.token)
              .expect(200)
              .then(result2 => {
                expect(result2.body).toEqual([]);
              });
          });
      });
  });

  it('gets all favorites for a user', () => {
    return request
      .post('/api/crystals')
      .set('Authorization', user.token)
      .send(crystal)
      .then(({ body }) => {
        return request
          .put(`/api/me/favorites/${body._id}`)
          .set('Authorization', user.token)
          .expect(200)
          .then(() => {
            return request
              .get(`/api/me/favorites/`)
              .set('Authorization', user.token)
              .expect(200)
              .then(result2 => {
                console.log(result2.body)
                expect(result2.body).toEqual([{ _id: body._id }]);
              });
          });
      });
  })
});