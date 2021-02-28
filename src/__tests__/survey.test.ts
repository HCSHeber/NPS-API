import request from 'supertest';
import { getConnection } from 'typeorm';
import app from '../app';

import createConnection from '../database';

describe("Surveys", () => {
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    const connection = await getConnection();
    await connection.dropDatabase();
    await connection.close();
  })

  it("Should be able to create a new survey", async () => {
    const response = await request(app).post("/surveys").send({
      title: "testSurvey",
      description: "A test survey"
    });

    expect(response.status).toBe(201);
  });

  it("Should not be able to list all surveys", async () => {
    const response = await request(app).get("/surveys");

    expect(response.body.length).toBe(1);
  })

  
 
});