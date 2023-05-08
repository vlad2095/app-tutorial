const fastify = require("fastify")({ logger: true });

const PORT = process.env.PORT || 8080;
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = process.env.DB_PORT || 27017;

const dbUrl = `mongodb://${DB_HOST}:${DB_PORT}`;

const path = require("path");

fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
});

fastify.register(require("@fastify/mongodb"), {
  forceClose: true,
  url: dbUrl,
  database: "monk-guestbook"
});

fastify.register(require('@fastify/multipart'));

fastify.get("/", function (req, reply) {
  reply.sendFile("index.html");
});

fastify.get("/posts", async function (req, reply) {
  const posts = this.mongo.db.collection("posts");
  try {
    const c = await posts.find();
    return (await c.toArray()).reverse();
  } catch (err) {
    return [];
  }
});

fastify.post("/posts", async function (req, reply) {
    const posts = this.mongo.db.collection("posts");
    try {
      const file = await req.file();

      // const contents = file.toBuffer();
      // const params = {
      //   Bucket: 'guestbook-photos',
      //   Key: file.filename,
      //   Body: contents,
      //   ContentType: file.mimetype
      // };
      // const s3Response = await s3.upload(params).promise();
      // console.log(s3Response);
      

      await posts.insertOne({message: file.fields.message.value, name: file.fields.name.value, date: new Date()});
      return {ok: true};
    } catch (err) {
      console.log(err);
      return {ok: false, error: err};
    }
  });

fastify.get("/post/:id", async function (req, reply) {
  const posts = this.mongo.db.collection("posts");

  const id = this.mongo.ObjectId(req.params.id);
  try {
    const post = await posts.findOne({ id });
    return post;
  } catch (err) {
    return {ok: false, error: err};
  }
});

fastify.listen({ port: PORT, host: "0.0.0.0" }, (err) => {
  if (err) throw err;
});
