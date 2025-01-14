import mongoose, { Schema } from "mongoose";
import Express from "express";
import cors from "cors";
import amqplib from "amqplib";

const mongoUri = "mongodb://user:password@localhost:27017/listDB?authSource=admin";

mongoose.connect(mongoUri);
mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB");
});

const ListMdl = mongoose.model("List", {
    postId: Schema.ObjectId,
    title: String,
    description: String,
    comments: Number
});

amqplib.connect("amqp://user:password@localhost:14001").then(conn => {
    conn.createChannel().then(ch => {
        const queue = "update-list-comment";
        ch.assertExchange("comment", "fanout", { durable: false })
        ch.assertQueue(queue, { durable: false });
        ch.bindQueue(queue, "comment", "");
        ch.consume(queue, msg => {
            const { postId, comments } = JSON.parse(msg.content.toString());
            ListMdl.findById(postId).then(async item => {
                if (item) {
                    item.comments = comments;
                    await item.save();
                }
                ch.ack(msg);
            });
        });
    });

    conn.createChannel().then(ch => {
        const queue = "add-list-item";
        ch.assertQueue(queue, { durable: false });
        ch.consume(queue, msg => {
            console.log(JSON.parse(msg.content.toString()));
            const { postId, title, description, comments } = JSON.parse(msg.content.toString());
            ListMdl.findById(postId).then(async item => {
                if(item){
                    item.title = title;
                    item.description = description;
                    item.comments = comments;
                    await item.save();
                }else{
                    ListMdl.create({ postId, title, description, comments: parseInt(comments) });
                }
                ch.ack(msg);
            });
        });
    });
});

const app = Express();

app.use(cors());
app.use(Express.json());

app.get("/", async (req, res) => {
    const lists = await ListMdl.find();
    if(lists.length > 0) res.json(lists);
    else res.status(404).send([]);
});

app.listen(14002, () => {
    console.log("Service List is running: http://localhost:14002/");
});