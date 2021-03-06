const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/taskModel')
const {
  userOneId,
  userTwo,
  userOne,
  taskOne,
  setupDatabase,
} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create task for user', async () => {
  const response = await request(app)
    .post('/task')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: 'From my test',
    })
    .expect(201)

  const task = await Task.findById(response.body._id)
  expect(task).not.toBeNull()
  expect(task.completed).toBe(false)
})

test('Should fetch user tasks', async () => {
  const response = await request(app)
    .get('/task')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

  expect(response.body.length).toEqual(2)
})

test('Should note delete other users task', async () => {
  const response = await request(app)
    .delete(`/task/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}}`)
    .send()
    .expect(401)

  const task = await Task.findById(taskOne._id)
  expect(task).not.toBeNull()
})
