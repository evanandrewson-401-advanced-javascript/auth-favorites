const request = require('../request');
const { dropCollection } = require('../db');
const { signupUser } = require('../data-helpers');

describe('Crystals API', () => {
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

  it('posts a crystal for this user', () => {
    return request
      .post('/api/crystals')
      .set('Authorization', user.token)
      .send(crystal)
      .expect(200)
      .then(({ body }) => {
        expect(body.owner).toBe(user._id);
        expect(body).toMatchInlineSnapshot(
          {
            _id: expect.any(String),
            owner: expect.any(String)
          },
          `
          Object {
            "__v": 0,
            "_id": Any<String>,
            "category": "quartz",
            "description": "purple and amazing",
            "name": "Amethyst",
            "owner": Any<String>,
            "price": 5,
          }
        `
        );
      });
  });

  it('updates a crystal', () => {
    return request
      .post('/api/crystals')
      .set('Authorization', user.token)
      .send(crystal)
      .expect(200)
      .then(({ body }) => {
        return request
          .put(`/api/crystals/${body._id}`)
          .set('Authorization', user.token)
          .send({ price: 10 })
          .expect(200)
          .then(({ body }) => {
            expect(body.price).toBe(10);
          });
      });
  });

  it('deletes a crystal', () => {
    return request
      .post('/api/crystals')
      .set('Authorization', user.token)
      .send(crystal)
      .expect(200)
      .then(({ body }) => {
        return request
          .delete(`/api/crystals/${body._id}`)
          .set('Authorization', user.token)
          .expect(200)
      });
  })

});
