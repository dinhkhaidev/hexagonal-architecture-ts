# 📦 Microservices Node.js Starter (Express + RabbitMQ + Mongo + API Gateway)

This is a minimal but production-leaning microservices skeleton you can run locally with Docker Compose.

**Stack**: Node.js (Express), MongoDB, RabbitMQ, API Gateway (Express + http-proxy), Clean-ish layering.

---

## File Tree

```
.
├─ docker-compose.yml
├─ README.md
├─ api-gateway/
│  ├─ package.json
│  └─ src/
│     └─ index.js
├─ product-service/
│  ├─ package.json
│  └─ src/
│     ├─ index.js
│     ├─ api/
│     │  ├─ routes/
│     │  │  └─ products.js
│     │  └─ middlewares/validate.js
│     ├─ application/
│     │  └─ use_cases/
│     │     ├─ createProduct.js
│     │     └─ getProductById.js
│     ├─ domain/
│     │  └─ entities/Product.js
│     └─ infrastructure/
│        ├─ config/index.js
│        ├─ database/mongoose.js
│        ├─ messaging/rabbit.js
│        └─ repositories/product.repo.js
└─ order-service/
   ├─ package.json
   └─ src/
      ├─ index.js
      ├─ api/
      │  └─ routes/orders.js
      ├─ application/
      │  └─ use_cases/createOrder.js
      └─ infrastructure/
         ├─ config/index.js
         ├─ database/mongoose.js
         └─ messaging/rabbit.js
```

---

## docker-compose.yml

```yaml
version: "3.8"
services:
  api-gateway:
    build: ./api-gateway
    container_name: api-gateway
    ports:
      - "3000:3000"
    environment:
      - PRODUCT_SERVICE_URL=http://product-service:3001
      - ORDER_SERVICE_URL=http://order-service:3002
    depends_on:
      - product-service
      - order-service

  product-service:
    build: ./product-service
    container_name: product-service
    ports:
      - "3001:3000"
    environment:
      - MONGO_URL=mongodb://mongo:27017/products
      - RABBITMQ_URL=amqp://rabbitmq:5672
      - SERVICE_NAME=product-service
    depends_on:
      - mongo
      - rabbitmq

  order-service:
    build: ./order-service
    container_name: order-service
    ports:
      - "3002:3000"
    environment:
      - MONGO_URL=mongodb://mongo:27017/orders
      - RABBITMQ_URL=amqp://rabbitmq:5672
      - SERVICE_NAME=order-service
    depends_on:
      - mongo
      - rabbitmq

  mongo:
    image: mongo:6
    container_name: mongo
    ports:
      - "27017:27017"

  rabbitmq:
    image: rabbitmq:3-management
    container_name: rabbitmq
    ports:
      - "5672:5672"
      - "15672:15672"
```

---

## api-gateway/package.json

```json
{
  "name": "api-gateway",
  "version": "1.0.0",
  "main": "src/index.js",
  "type": "module",
  "scripts": {
    "start": "node src/index.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.19.2",
    "http-proxy-middleware": "^3.0.0",
    "morgan": "^1.10.0"
  }
}
```

## api-gateway/src/index.js

```js
import express from "express";
import morgan from "morgan";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const PRODUCT_SERVICE_URL =
  process.env.PRODUCT_SERVICE_URL || "http://localhost:3001";
const ORDER_SERVICE_URL =
  process.env.ORDER_SERVICE_URL || "http://localhost:3002";

// Simple routing rules
app.use(
  "/products",
  createProxyMiddleware({ target: PRODUCT_SERVICE_URL, changeOrigin: true })
);
app.use(
  "/orders",
  createProxyMiddleware({ target: ORDER_SERVICE_URL, changeOrigin: true })
);

app.get("/health", (_, res) => res.json({ status: "ok", gateway: true }));

const port = 3000;
app.listen(port, () => console.log(`API Gateway running on :${port}`));
```

---

## product-service/package.json

```json
{
  "name": "product-service",
  "version": "1.0.0",
  "main": "src/index.js",
  "type": "module",
  "scripts": {
    "start": "node src/index.js"
  },
  "dependencies": {
    "amqplib": "^0.10.4",
    "express": "^4.19.2",
    "joi": "^17.13.3",
    "mongoose": "^8.5.3",
    "morgan": "^1.10.0"
  }
}
```

## product-service/src/infrastructure/config/index.js

```js
export const config = {
  mongoUrl: process.env.MONGO_URL || "mongodb://localhost:27017/products",
  rabbitUrl: process.env.RABBITMQ_URL || "amqp://localhost:5672",
  serviceName: process.env.SERVICE_NAME || "product-service",
};
```

## product-service/src/infrastructure/database/mongoose.js

```js
import mongoose from "mongoose";
import { config } from "../config/index.js";

export async function connectMongo() {
  mongoose.set("strictQuery", true);
  await mongoose.connect(config.mongoUrl);
  console.log(`[Mongo] connected ${config.mongoUrl}`);
}
```

## product-service/src/infrastructure/messaging/rabbit.js

```js
import amqplib from "amqplib";
import { config } from "../config/index.js";

let channel;
const EXCHANGE = "app.events";

export async function connectRabbit() {
  const conn = await amqplib.connect(config.rabbitUrl);
  channel = await conn.createChannel();
  await channel.assertExchange(EXCHANGE, "topic", { durable: true });
  console.log("[RabbitMQ] connected", config.rabbitUrl);
}

export function publish(eventKey, payload) {
  if (!channel) throw new Error("RabbitMQ channel not ready");
  const msg = Buffer.from(JSON.stringify(payload));
  channel.publish(EXCHANGE, eventKey, msg, { persistent: true });
}

export async function subscribe(eventKey, handler) {
  if (!channel) throw new Error("RabbitMQ channel not ready");
  const q = await channel.assertQueue("", { exclusive: true });
  await channel.bindQueue(q.queue, EXCHANGE, eventKey);
  await channel.consume(q.queue, (msg) => {
    if (!msg) return;
    try {
      const data = JSON.parse(msg.content.toString());
      handler(data);
      channel.ack(msg);
    } catch (e) {
      console.error("消费失败", e);
      channel.nack(msg, false, false);
    }
  });
}
```

## product-service/src/domain/entities/Product.js

```js
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

export const ProductModel = mongoose.model("Product", ProductSchema);
```

## product-service/src/infrastructure/repositories/product.repo.js

```js
import { ProductModel } from "../../domain/entities/Product.js";

export const productRepo = {
  async create({ name, price, stock }) {
    const doc = await ProductModel.create({ name, price, stock });
    return doc.toObject();
  },
  async findById(id) {
    const doc = await ProductModel.findById(id);
    return doc ? doc.toObject() : null;
  },
};
```

## product-service/src/application/use_cases/createProduct.js

```js
import { productRepo } from "../../infrastructure/repositories/product.repo.js";
import { publish } from "../../infrastructure/messaging/rabbit.js";

export async function createProduct(input) {
  const created = await productRepo.create(input);
  // Publish domain event for other services
  publish("product.created", { product: created });
  return created;
}
```

## product-service/src/application/use_cases/getProductById.js

```js
import { productRepo } from "../../infrastructure/repositories/product.repo.js";

export async function getProductById(id) {
  return await productRepo.findById(id);
}
```

## product-service/src/api/middlewares/validate.js

```js
import Joi from "joi";

export function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res
        .status(400)
        .json({ errors: error.details.map((d) => d.message) });
    }
    req.validated = value;
    next();
  };
}
```

## product-service/src/api/routes/products.js

```js
import { Router } from "express";
import Joi from "joi";
import { validate } from "../middlewares/validate.js";
import { createProduct } from "../../application/use_cases/createProduct.js";
import { getProductById } from "../../application/use_cases/getProductById.js";

const router = Router();

router.get("/:id", async (req, res) => {
  const product = await getProductById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

router.post(
  "/",
  validate(
    Joi.object({
      name: Joi.string().min(2).required(),
      price: Joi.number().min(0).required(),
      stock: Joi.number().integer().min(0).required(),
    })
  ),
  async (req, res) => {
    const product = await createProduct(req.validated);
    res.status(201).json(product);
  }
);

export default router;
```

## product-service/src/index.js

```js
import express from "express";
import morgan from "morgan";
import productsRouter from "./api/routes/products.js";
import { connectMongo } from "./infrastructure/database/mongoose.js";
import { connectRabbit } from "./infrastructure/messaging/rabbit.js";

const app = express();
app.use(express.json());
app.use(morgan("dev"));

app.use("/products", productsRouter);
app.get("/health", (_, res) => res.json({ status: "ok", service: "product" }));

const port = 3000;

(async () => {
  await connectMongo();
  await connectRabbit();
  app.listen(port, () => console.log(`Product service running on :${port}`));
})();
```

---

## order-service/package.json

```json
{
  "name": "order-service",
  "version": "1.0.0",
  "main": "src/index.js",
  "type": "module",
  "scripts": {
    "start": "node src/index.js"
  },
  "dependencies": {
    "amqplib": "^0.10.4",
    "express": "^4.19.2",
    "mongoose": "^8.5.3",
    "morgan": "^1.10.0"
  }
}
```

## order-service/src/infrastructure/config/index.js

```js
export const config = {
  mongoUrl: process.env.MONGO_URL || "mongodb://localhost:27017/orders",
  rabbitUrl: process.env.RABBITMQ_URL || "amqp://localhost:5672",
  serviceName: process.env.SERVICE_NAME || "order-service",
};
```

## order-service/src/infrastructure/database/mongoose.js

```js
import mongoose from "mongoose";
import { config } from "../config/index.js";

export async function connectMongo() {
  mongoose.set("strictQuery", true);
  await mongoose.connect(config.mongoUrl);
  console.log(`[Mongo] connected ${config.mongoUrl}`);
}

const OrderSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    qty: { type: Number, required: true, min: 1 },
    amount: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

export const OrderModel = mongoose.model("Order", OrderSchema);
```

## order-service/src/infrastructure/messaging/rabbit.js

```js
import amqplib from "amqplib";
import { config } from "../config/index.js";

let channel;
const EXCHANGE = "app.events";

export async function connectRabbit() {
  const conn = await amqplib.connect(config.rabbitUrl);
  channel = await conn.createChannel();
  await channel.assertExchange(EXCHANGE, "topic", { durable: true });
  console.log("[RabbitMQ] connected", config.rabbitUrl);
}

export function publish(eventKey, payload) {
  if (!channel) throw new Error("RabbitMQ channel not ready");
  const msg = Buffer.from(JSON.stringify(payload));
  channel.publish(EXCHANGE, eventKey, msg, { persistent: true });
}

export async function subscribe(eventKey, handler) {
  if (!channel) throw new Error("RabbitMQ channel not ready");
  const q = await channel.assertQueue("", { exclusive: true });
  await channel.bindQueue(q.queue, EXCHANGE, eventKey);
  await channel.consume(q.queue, (msg) => {
    if (!msg) return;
    try {
      const data = JSON.parse(msg.content.toString());
      handler(data);
      channel.ack(msg);
    } catch (e) {
      console.error("消费失败", e);
      channel.nack(msg, false, false);
    }
  });
}
```

## order-service/src/application/use_cases/createOrder.js

```js
import { OrderModel } from "../../infrastructure/database/mongoose.js";
import { publish } from "../../infrastructure/messaging/rabbit.js";

export async function createOrder({ productId, qty, unitPrice }) {
  const amount = qty * unitPrice;
  const order = await OrderModel.create({ productId, qty, amount });
  publish("order.created", { order });
  return order.toObject();
}
```

## order-service/src/api/routes/orders.js

```js
import { Router } from "express";
import { createOrder } from "../../application/use_cases/createOrder.js";

const router = Router();

router.post("/", async (req, res) => {
  const { productId, qty, unitPrice } = req.body || {};
  if (!productId || !qty || !unitPrice)
    return res.status(400).json({ message: "Invalid payload" });
  const order = await createOrder({ productId, qty, unitPrice });
  res.status(201).json(order);
});

export default router;
```

## order-service/src/index.js

```js
import express from "express";
import morgan from "morgan";
import ordersRouter from "./api/routes/orders.js";
import { connectMongo } from "./infrastructure/database/mongoose.js";
import { connectRabbit, subscribe } from "./infrastructure/messaging/rabbit.js";

const app = express();
app.use(express.json());
app.use(morgan("dev"));

app.use("/orders", ordersRouter);
app.get("/health", (_, res) => res.json({ status: "ok", service: "order" }));

const port = 3000;

(async () => {
  await connectMongo();
  await connectRabbit();

  // Example: consume product.created to keep a local read model or cache (demo only)
  await subscribe("product.created", (evt) => {
    console.log(
      "[order-service] observed product.created",
      evt?.product?._id,
      evt?.product?.name
    );
  });

  app.listen(port, () => console.log(`Order service running on :${port}`));
})();
```

---

## README.md (quick start)

````md
# Quick Start

## Prerequisites

- Docker & Docker Compose

## Run

```bash
docker compose up --build
```
````

### Health checks

- Gateway: http://localhost:3000/health
- Product: http://localhost:3001/health
- Order: http://localhost:3002/health
- Rabbit UI: http://localhost:15672 (guest/guest)

### Sample flow

1. Create a product (through gateway):

```bash
curl -X POST http://localhost:3000/products \
  -H 'Content-Type: application/json' \
  -d '{"name":"iPhone 15","price":2000,"stock":10}'
```

2. Get the product by id:

```bash
curl http://localhost:3000/products/<PRODUCT_ID>
```

3. Create an order (demo calculation):

```bash
curl -X POST http://localhost:3000/orders \
  -H 'Content-Type: application/json' \
  -d '{"productId":"<PRODUCT_ID>","qty":2,"unitPrice":2000}'
```

## Notes

- Each service has its own DB.
- Services communicate by publishing/consuming events via RabbitMQ topic exchange `app.events`.
- Add auth, tracing, retries, and saga orchestration as you evolve.
