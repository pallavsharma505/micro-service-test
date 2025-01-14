import mongoose from "mongoose";
import Express from "express";
import cors from "cors";
import amqplib from "amqplib";

const mongoUri = "mongodb://user:password@localhost:27017/postDB?authSource=admin";

mongoose.connect(mongoUri);
mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB");
});

const PostMdl = mongoose.model("Post", {
    title: String,
    description: String,
    content: String,
    comments: Number
});

var listChannel = null;
amqplib.connect("amqp://user:password@localhost:14001").then(conn => {
    conn.createChannel().then(ch => {
        const queue = "update-post-comment";
        ch.assertExchange("comment", "fanout", { durable: false })
        ch.assertQueue(queue, { durable: false });
        ch.bindQueue(queue, "comment", "");
        ch.consume(queue, msg => {
            const { postId, comments } = JSON.parse(msg.content.toString());
            PostMdl.findById(postId).then(async item => {
                if (item) {
                    item.comments = comments;
                    await item.save();
                }
                ch.ack(msg);
            });
        });
    });

    conn.createChannel().then(ch => {
        ch.assertQueue("add-list-item", { durable: false });
        listChannel = ch;
    });
});

const app = Express();

app.use(cors());
app.use(Express.json());

app.get("/", async (req, res) => {
    const lists = await PostMdl.find();
    if(lists.length > 0) res.json(lists);
    else res.status(404).send([]);
});

app.get("/:id", async (req, res) => {
    const item = await PostMdl.findById(req.params.id);
    if(item) res.json(item);
    else res.status(404).send({
        msg: "Post not found",
        id: req.params.id
    });
});

app.post("/", async (req, res) => {
    const { title, description, content, comments } = req.body;
    if(!title || !description || !content || comments == undefined) {
        res.status(400).send({
            msg: "Invalid request body",
            body: req.body
        });
        return;
    }

    PostMdl.create({ title, description, content, comments }).then(async item => {
        let sendItem = {...item._doc};
        if(listChannel) {
            sendItem.postId = sendItem._id;
            delete sendItem._id;
            listChannel.sendToQueue("add-list-item", Buffer.from(JSON.stringify(sendItem)));
        }
        res.json({
            msg: "Post created",
            item,
            sendItem
        });
    });
});

app.listen(14003, () => {
    console.log("Service List is running: http://localhost:14003/");
});