import {createError} from "../error.js";
import video from "../models/video.js"
import user from "../models/user.js";
import {esClient} from "../utils/syncTo.js";


export const search = async (req, res, next) => {
    const query = req.query.q;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    console.log(`搜索查询: "${query}", 页码: ${page}, 每页限制: ${limit}`);

    try {
        const searchBody = {
            query: {
                multi_match: {
                    query: query,
                    fields: ['title^3', 'desc^2', 'tags^2', 'doc.title^3', 'doc.desc^2', 'doc.tags^2'],
                    fuzziness: 'AUTO',
                    operator: 'or'
                }
            }
        };

        console.log('搜索查询体:', JSON.stringify(searchBody, null, 2));

        const result = await esClient.search({
            index: 'videos',
            body: searchBody,
            from: (page - 1) * limit,
            size: limit
        });

        console.log(`搜索结果总数: ${result.hits.total.value}`);

        const videos = result.hits.hits.map(hit => {
            const source = hit._source;
            const doc = source.doc || {};
            return {
                _id: hit._id,
                title: doc.title || source.title,
                desc: doc.desc || source.desc,
                tags: doc.tags || source.tags,
                userId: doc.userId || source.userId,
                imgUrl: doc.imgUrl || source.imgUrl,
                duration: doc.duration || source.duration,
                createdAt: doc.createdAt || source.createdAt,
                views: doc.views || source.views,
            };
        });

        console.log(`返回的视频数量: ${videos.length}`);

        res.status(200).json(videos);
    } catch (err) {
        console.error('Elasticsearch 错误:', err);
        res.status(500).json({ error: err.message });
    }
};






export const addVideo = async (req, res, next) => {
    const newVideo = new video({userId: req.user.id, ...req.body});
    try {
        const savedVideo = await newVideo.save();
        res.status(200).json(savedVideo);
    } catch (err) {
        next(err);
    }
}


export const deleteVideo = async (req, res, next) => {

    try {
        await video.findByIdAndDelete(req.params.id)
        res.status(200).json("注销成功")
    } catch (err) {
        next(err);
    }

}


export const updateVideo = async (req, res, next) => {
    try {
        const videoUpdate = await video.findById(req.params.id);
        if (!videoUpdate) next(createError(404, "未找到视频"));

        const updatedVideo = await video.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true});
        res.status(200).json(updatedVideo);

    } catch (err) {
        next(err);
    }
}


export const getVideo = async (req, res, next) => {
    try {
        const videoGet = await video.findById(req.params.id);
        res.status(200).json(videoGet);
    } catch (err) {
        next(err);
    }
}


export const addView = async (req, res, next) => {

    try {
        await video.findByIdAndUpdate(req.params.id, {$inc: {views: 1}});
        res.status(200).json("播放量已增加")
    } catch (err) {
        next(err);
    }
}


export const randomVideo = async (req, res, next) => {

    try {
        const videoRandom = await video.aggregate([{$sample: {size: 20}}]);
        res.status(200).json(videoRandom);
    } catch (err) {
        next(err);
    }
}


export const trend = async (req, res, next) => {

    try {
        const videoTrend = await video.find().sort({views: -1})
        res.status(200).json(videoTrend);
    } catch (err) {
        next(err);
    }
}

export const getAll = async (req, res, next) => {

    try {
        const videoTrend = await video.find();
        res.status(200).json(videoTrend);
    } catch (err) {
        next(err);
    }
}

export const getUserVideos = async (req, res, next) => {
    try {
        const videos = await video.find({userId: req.params.id});
        res.status(200).json(videos);
    } catch (err) {
        next(err);
    }
};

export const getLikedVideos = async (req, res, next) => {
    try {
        const videos = await video.find({likes: req.params.id});
        res.status(200).json(videos);
    } catch (err) {
        next(err);
    }
};

export const sub = async (req, res, next) => {

    try {
        const userSub = await user.findById(req.user.id);
        const subscribedChannels = userSub.subscribedUsers;

        const list = await Promise.all(subscribedChannels.map((channelId) => {
            return video.find({userId: channelId})
        }))
        res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
    } catch (err) {
        next(err);
    }
}


export const getByTag = async (req, res, next) => {
    const tags = req.query.tags.split(",");
    try {
        const videos = await video.find({tags: {$in: tags}}).limit(20);
        res.status(200).json(videos);
    } catch (err) {
        next(err);
    }
}


