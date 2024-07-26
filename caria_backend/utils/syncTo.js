import { Client } from '@elastic/elasticsearch';
import { MongoClient } from 'mongodb';
import dotenv from "dotenv";

dotenv.config();

export const esClient = new Client({
    node: 'https://localhost:9200',
    auth:{
        username:'elastic',
        password: process.env.ELA_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

export const syncTo = async () => {
    const mongoClient = new MongoClient(process.env.MONGO);

    try {
        console.log("开始连接到 MongoDB...");
        await mongoClient.connect();
        console.log("MongoDB 连接成功");

        const db = mongoClient.db('test');
        const collection = db.collection('videos');

        console.log("开始连接到 Elasticsearch...");
        await esClient.ping();
        console.log("Elasticsearch 连接成功");

        console.log("删除旧的 Elasticsearch 索引...");
        await esClient.indices.delete({ index: 'videos' }, { ignore: [404] });
        console.log("旧的 Elasticsearch 索引删除成功");

        console.log("开始创建 Elasticsearch 索引...");
        await esClient.indices.create({
            index: 'videos',
            body: {
                mappings: {
                    properties: {
                        title: { type: 'text' },
                        desc: { type: 'text' },
                        tags: { type: 'keyword' },
                        userId: { type: 'keyword' }
                    }
                }
            }
        }, { ignore: [400] });
        console.log("Elasticsearch 索引创建成功");

        const cursor = collection.find();
        const operations = [];

        await cursor.forEach(doc => {
            operations.push({
                index: {
                    _index: 'videos',
                    _id: doc._id.toString()
                }
            });
            operations.push({
                title: doc.title,
                desc: doc.desc,
                tags: doc.tags,
                userId: doc.userId,
                views: doc.views,
                createdAt: doc.createdAt,
                imgUrl: doc.imgUrl,
            });
        });

        const result = await esClient.bulk({
            refresh: true,
            body: operations
        });

        console.log("数据同步完成");
        // 调试
        // console.log(result);
    } catch (error) {
        console.error("数据同步失败", error);
    } finally {
        await mongoClient.close();
    }
};
