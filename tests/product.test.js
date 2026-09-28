require("dotenv").config();

const request = require("supertest");
const mongoose = require("mongoose");

jest.setTimeout(30000);

const app = require("../app");
const Product = require("../models/Product");

beforeAll(async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/productdb", {
    serverSelectionTimeoutMS: 5000
  });
});

afterEach(async () => {
  await Product.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Product CRUD API", () => {

  test("CREATE product", async () => {

    const response = await request(app)
      .post("/products")
      .send({
        pid: "P001",
        pname: "Blue Pen",
        price: 10000,
        quantity: 20
      });

    expect(response.statusCode).toBe(201);

    expect(response.body.pid).toBe("P001");
  });


  test("READ all products", async () => {

    await Product.create({
      pid: "P001",
      pname: "Blue Pen",
      price: 10000,
      quantity: 20
    });

    const response = await request(app)
      .get("/products");

    expect(response.statusCode).toBe(200);

    expect(response.body.length).toBe(1);
  });


  test("READ one product", async () => {

    await Product.create({
      pid: "P001",
      pname: "Blue Pen",
      price: 10000,
      quantity: 20
    });

    const response = await request(app)
      .get("/products/P001");

    expect(response.statusCode).toBe(200);

    expect(response.body.pid).toBe("P001");
  });


  test("UPDATE product", async () => {

    await Product.create({
      pid: "P001",
      pname: "Blue Pen",
      price: 10000,
      quantity: 20
    });

    const response = await request(app)
      .put("/products/P001")
      .send({
        pname: "Premium Blue Pen",
        price: 15000,
        quantity: 30
      });

    expect(response.statusCode).toBe(200);

    expect(response.body.price).toBe(15000);

    expect(response.body.quantity).toBe(30);
  });


  test("DELETE product", async () => {

    await Product.create({
      pid: "P001",
      pname: "Blue Pen",
      price: 10000,
      quantity: 20
    });

    const response = await request(app)
      .delete("/products/P001");

    expect(response.statusCode).toBe(200);

    const product = await Product.findOne({
      pid: "P001"
    });

    expect(product).toBeNull();
  });

});