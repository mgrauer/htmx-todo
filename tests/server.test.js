const request = require("supertest");
const { mock } = require("jest-mock-extended");
//const TodoList = require("./server/models/TodoList");
const app = require("../server/server");
/*
// Mock the TodoList model
const MockTodoList = mock();

// Mock out a list of TodoLists
const mockData = [
  new MockTodoList({ name: "A", id: 1, todos: [] }),
  new MockTodoList({ name: "B", id: 2, todos: [] }),
  new MockTodoList({ name: "C", id: 3, todos: [] }),
  new MockTodoList({ name: "D", id: 4, todos: [] }),
  new MockTodoList({ name: "E", id: 5, todos: [] }),
];
*/

// Use the mock data in your tests...

describe("Server Endpoints", () => {
  test("Test sequence of requests", async () => {
    // POST /api/list to create a new list

    // Problem is that we aren't sending the right info, need to be form encoded and maybe other things
    // another problem is that this test is causing the server to save state, which is not good
    // another problem is that there is some async operation not stopped, perhaps the server is still running?

    let response = await request(app).post("/api/list").send({ name: "A" });
    expect(response.statusCode).toBe(200);
    const listId = response.body.id; // assuming the response includes the id of the new list
    console.log(response);

    /*
    // GET /api/list/:id to get the list
    response = await request(app).get(`/api/list/${listId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ name: "Test List", id: listId, todos: [] }); // adjust this to match the expected response

    // DELETE /api/list/:id to delete the list
    response = await request(app).delete(`/api/list/${listId}`);
    expect(response.statusCode).toBe(200);

    // GET /api/list/:id to try to get the deleted list (should fail)
    response = await request(app).get(`/api/list/${listId}`);
    expect(response.statusCode).toBe(404);*/
  });

  // Add more tests...
});

/*
describe("Server Endpoints", () => {
  // test to get the list
  // add one to the end, test it is there
  // delete one from the end, test it is gone
  // delete one from the start, test it is gone
  // delete one from the middle, test it is gone

  // test that the html we get is correct for the overall list
  // test that the html we get is correct for the individual list
  // how do we do that without having to encode the html? or break the interface of the template, or make it brittle?

  // Test for GET /api/list
  it("should get all todo lists", async () => {
    const res = await request(app).get("/api/list");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("todoLists");
  });

  // Test for POST /api/list
  it("should create a new todo list", async () => {
    const res = await request(app).post("/api/list").send({
      name: "Test List",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toEqual("Test List");
  });

  // Add more tests for other endpoints...
});
*/
