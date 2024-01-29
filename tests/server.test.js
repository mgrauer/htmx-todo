const request = require("supertest");
const app = require("../server/server");

describe("Server Endpoints", () => {
  beforeEach(() => {
    // TODO cp data/test-storage.json.bak data/test-storage.json
    // TODO move the test-storage file to a test_data folder, and add it to source control
  });

  // TODO break these into smaller tests so that we can test each endpoint independently and get a better sense of which one is breaking
  // the overall sequence of requests is a very stateful test
  // Todo the server persists past tests, or some kind of async operations persist

  test("Test sequence of requests", async () => {
    // Test initial db state with get of application root
    let response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.headers["content-type"]).toEqual(
      expect.stringContaining("text/html")
    );
    expect(response.text).toEqual(expect.stringContaining('value="A"'));
    expect(response.text).toEqual(expect.stringContaining('value="B"'));
    expect(response.text).toEqual(expect.stringContaining('value="C"'));
    expect(response.text).toEqual(expect.stringContaining('value="D"'));
    expect(response.text).toEqual(expect.stringContaining('value="E"'));

    // DELETE last entry
    response = await request(app).delete(`/api/list/5`);
    expect(response.statusCode).toBe(200);

    // Test only last entry is gone
    response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.headers["content-type"]).toEqual(
      expect.stringContaining("text/html")
    );
    expect(response.text).toEqual(expect.stringContaining('value="A"'));
    expect(response.text).toEqual(expect.stringContaining('value="B"'));
    expect(response.text).toEqual(expect.stringContaining('value="C"'));
    expect(response.text).toEqual(expect.stringContaining('value="D"'));
    expect(response.text).not.toEqual(expect.stringContaining('value="E"'));

    // Add last entry in again

    // TODO post not working, probably not sending right form encoded data
    // TODO Also want to test updating one of the entries
    // TODO Try to get one by id correctly and then one that has been deleted

    response = await request(app).post("/api/list").send({
      name: "E",
      todos: [],
    });

    // Test that all entries exist
    response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.headers["content-type"]).toEqual(
      expect.stringContaining("text/html")
    );
    expect(response.text).toEqual(expect.stringContaining('value="A"'));
    expect(response.text).toEqual(expect.stringContaining('value="B"'));
    expect(response.text).toEqual(expect.stringContaining('value="C"'));
    expect(response.text).toEqual(expect.stringContaining('value="D"'));
    // TODO failing here
    expect(response.text).toEqual(expect.stringContaining('value="E"'));
  });
});
