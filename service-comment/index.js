import mongoose, { Schema } from "mongoose";
import Express from "express";
import cors from "cors";
import amqplib from "amqplib";

const mongoUri =
    "mongodb://user:password@localhost:27017/commentsDB?authSource=admin";

mongoose.connect(mongoUri);
mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB");
});

const CommentsMdl = mongoose.model("List", {
    postId: Schema.ObjectId,
    data: String,
});
const queue1 = "update-list-comment";
const queue2 = "update-post-comment";
var commentChannel = null;

amqplib.connect("amqp://user:password@localhost:14001").then((conn) => {
    conn.createChannel().then((ch) => {
        ch.assertExchange("comment", "fanout", { durable: false });
        ch.assertQueue(queue1, { durable: false });
        ch.bindQueue(queue1, "comment", "");
        ch.assertQueue(queue2, { durable: false });
        ch.bindQueue(queue2, "comment", "");
        commentChannel = ch;
    });
});

const app = Express();

app.use(cors());
app.use(Express.json());

app.get("/", async (req, res) => {
    const lists = await CommentsMdl.find();
    if (lists.length > 0) res.json(lists);
    else res.status(404).send([]);
});

app.get("/:postId", async (req, res) => {
    const item = await CommentsMdl.find({ postId: req.params.postId });
    if (item) res.json(item);
    else res.status(404).send([]);
});

app.post("/", async (req, res) => {
    const { postId, data } = req.body;
    const item = await CommentsMdl.findById(postId);
    if (item) {
        item.data = data;
        await item.save();
    } else {
        CommentsMdl.create({ postId, data });
    }
    if (commentChannel) {
        CommentsMdl.countDocuments({ postId })
        .then(count => {
            commentChannel.publish(
                "comment",
                queue1,
                Buffer.from(JSON.stringify({ postId, comments: count }))
            );
            commentChannel.publish(
                "comment",
                queue2,
                Buffer.from(JSON.stringify({ postId, comments: count }))
            );
        })
    }
    res.send({ msg: "Comment added" });
});

app.listen(14004, () => {
    console.log("Service List is running: http://localhost:14004/");
});
