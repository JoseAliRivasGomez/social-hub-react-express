const {request, response} = require('express');
const {Schedule, Post, Scheduled_Post, Posts_Channels, Post_Type, Channel, User, Channels_Users} = require('../models/db');
const {TwitterApi} = require('twitter-api-v2');
const requestApi = require('request');
const { zonedTimeToUtc, utcToZonedTime, format, formatInTimeZone } = require('date-fns-tz')
const getDay = require('date-fns/getDay')
const toDate = require('date-fns/toDate')
const getHours = require('date-fns/getHours')
const getMinutes = require('date-fns/getMinutes')

class Publisher {

    constructor() {
        setTimeout(() => {
            (async()=>{
                this.post_type_scheduled = await this.getPostTypeScheduledId();
                this.post_type_queued = await this.getPostTypeQueuedId();
                if (!this.interval1) {
                    this.interval1 = setInterval(this.scheduled, 5000, this.post_type_scheduled);
                }
                if (!this.interval2) {
                    this.interval2 = setInterval(this.queued, 5000, this.post_type_queued);
                }
            })();
        }, 5000);
    }

    async getPostTypeScheduledId() {
        const post_type = await Post_Type.findOne({
            where: {
                name: 'Scheduled',
                state: true
            }
        });
        return post_type;
    }

    async getPostTypeQueuedId() {
        const post_type = await Post_Type.findOne({
            where: {
                name: 'Queued',
                state: true
            }
        });
        return post_type;
    }

    async scheduled(post_type_scheduled) {
        try {

            //console.log(1);
            const currentDate = Date.now();

            const posts = await Post.findAll({
                where: {
                    state: false,
                    post_type_id: post_type_scheduled.id
                },
                include: [Scheduled_Post,Channel],
            });

            posts.forEach(async (post) => {
                if(post.Scheduled_Post?.scheduledAt <= currentDate){
                    await Post.update({ state: true }, {
                        where: {
                            id: post.id
                        }
                    });

                    post.Channels.forEach(async (channel) => {
                        
                        const connection = await Channels_Users.findOne({
                            where: {
                                ChannelId: channel.id,
                                UserId: post.user_id,
                                state: true
                            }
                        });
                        if(channel.name === 'Twitter'){
                            if(connection){
                                await publishTwitter(connection.accessToken, connection.tokenSecret, post.post);
                            }
                        }else if(channel.name === 'LinkedIn'){
                            if(connection){
                                await publishLinkedIn(connection.mediaId, connection.accessToken, post.post);
                            }
                        }

                    });
                    
                }
            });
    
        } catch (error) {
            console.log(error);
        }
    }

    async queued(post_type_queued) {
        try {

            const users = await User.findAll({
                where: {
                    state: true,
                },
            });

            users.forEach(async (user) => {

                //console.log(user.first_name);

                //console.log(2); 
                // const currentDate = new Date();
                // const currentDay = currentDate.getUTCDay();
                // const currentHour = currentDate.getUTCHours();
                // const currentMinute = currentDate.getUTCMinutes();

                // console.log('Current Date');
                // console.log(currentDate);
                // console.log(currentDay);
                // console.log(currentHour);
                // console.log(currentMinute);

                const currentZonedDate = utcToZonedTime(new Date(), user.timeZone)
                const currentZonedDay = getDay(currentZonedDate);
                const currentZonedHour = getHours(currentZonedDate);
                const currentZonedMinute = getMinutes(currentZonedDate);

                // console.log('Current Zoned Date');
                // console.log(currentZonedDate);
                // console.log(currentZonedDay);
                // console.log(currentZonedHour);
                // console.log(currentZonedMinute);

                let currentZonedDayChar;
                if(currentZonedDay === 0 ){
                    currentZonedDayChar = 'D';
                }else if(currentZonedDay === 1 ){
                    currentZonedDayChar = 'L';
                }else if(currentZonedDay === 2 ){
                    currentZonedDayChar = 'K';
                }else if(currentZonedDay === 3 ){
                    currentZonedDayChar = 'M';
                }else if(currentZonedDay === 4 ){
                    currentZonedDayChar = 'J';
                }else if(currentZonedDay === 5 ){
                    currentZonedDayChar = 'V';
                }else if(currentZonedDay === 6 ){
                    currentZonedDayChar = 'S';
                }

                const postsInQueue = await Post.findAll({
                    where: {
                        user_id: user.id,
                        state: false,
                        post_type_id: post_type_queued.id
                    },
                    order: [
                        ['createdAt', 'ASC'],
                    ],
                    limit: 1,
                    include: [Channel],
                    //include: [Channel, Post_Type, Scheduled_Post],
                });

                const queuedPostsPublished = await Post.findAll({
                    where: {
                        user_id: user.id,
                        state: true,
                        post_type_id: post_type_queued.id
                    },
                    order: [
                        ['updatedAt', 'DESC'],
                    ],
                    limit: 1
                    //include: [Channel, Post_Type, Scheduled_Post],
                });

                // postsInQueue.forEach(async (post) => {
                //     console.log(post.id);
                // });

                //console.log(postsInQueue[0]?.id);

                // const firstPostInQueueDate = postsInQueue[0]?.createdAt;
                // const firstPostInQueueHour = firstPostInQueueDate?.getHours();
                // const firstPostInQueueMinute = firstPostInQueueDate?.getMinutes();

                const firstPostInQueueDate = utcToZonedTime(postsInQueue[0]?.createdAt, user.timeZone)
                const firstPostInQueueHour = getHours(firstPostInQueueDate);
                const firstPostInQueueMinute = getMinutes(firstPostInQueueDate);

                // console.log('First post in Queue');
                // console.log(firstPostInQueueDate);
                // console.log(firstPostInQueueHour);
                // console.log(firstPostInQueueMinute);

                //console.log(queuedPostsPublished[0]?.id);

                // const lastQueuedPostPublishedDate = queuedPostsPublished[0]?.updatedAt;
                // const lastQueuedPostPublishedHour = lastQueuedPostPublishedDate?.getHours();
                // const lastQueuedPostPublishedMinute = lastQueuedPostPublishedDate?.getMinutes();

                const lastQueuedPostPublishedDate = utcToZonedTime(queuedPostsPublished[0]?.updatedAt, user.timeZone)
                const lastQueuedPostPublishedHour = getHours(lastQueuedPostPublishedDate);
                const lastQueuedPostPublishedMinute = getMinutes(lastQueuedPostPublishedDate);

                // console.log('Last queued post published');                
                // console.log(lastQueuedPostPublishedDate);
                // console.log(lastQueuedPostPublishedHour);
                // console.log(lastQueuedPostPublishedMinute);

                const schedulesToday = await Schedule.findAll({
                    where: {
                        user_id: user.id,
                        state: true,
                        day: currentZonedDayChar
                    },
                });

                schedulesToday.forEach(async (schedule) => {
                    
                    const scheduleDate = new Date("July 21, 1983 " + schedule.time);
                    const scheduleHour = scheduleDate.getHours();
                    const scheduleMinute = scheduleDate.getMinutes();

                    // console.log('Schedule date');
                    // console.log(scheduleHour);
                    // console.log(scheduleMinute);

                    if ((scheduleHour == currentZonedHour) && (scheduleMinute == currentZonedMinute)) {

                        if((lastQueuedPostPublishedHour != undefined) && (lastQueuedPostPublishedHour == currentZonedHour) && (lastQueuedPostPublishedMinute == currentZonedMinute)){

                            //console.log('MISMO MINUTO');

                        }else{

                            //console.log('DIFERENTE MINUTO, PUBLICAR');

                            if(postsInQueue[0]){
                                await Post.update({ state: true }, {
                                    where: {
                                        id: postsInQueue[0].id
                                    }
                                });

                                postsInQueue[0].Channels.forEach(async (channel) => {
                        
                                    const connection = await Channels_Users.findOne({
                                        where: {
                                            ChannelId: channel.id,
                                            UserId: postsInQueue[0].user_id,
                                            state: true
                                        }
                                    });
                                    if(channel.name === 'Twitter'){
                                        if(connection){
                                            await publishTwitter(connection.accessToken, connection.tokenSecret, postsInQueue[0].post);
                                        }
                                    }else if(channel.name === 'LinkedIn'){
                                        if(connection){
                                            await publishLinkedIn(connection.mediaId, connection.accessToken, postsInQueue[0].post);
                                        }
                                    }
            
                                });

                                
                            }

                        }

                    }

                });

            });
    
        } catch (error) {
            console.log(error);
        }
    }


}

const getPosts = async (req = request, res = response) => {

    try {

        const {userJWT} = req;

        const {desde = '0', limite = '10'} = req.query;

        const [total, posts] = await Promise.all([
            Post.count({
                where: {
                    user_id: userJWT.id,
                }
            }),
            Post.findAll({
                where: {
                    user_id: userJWT.id,
                },
                order: [
                    ['createdAt', 'DESC'],
                ],
                include: [Channel, Post_Type, Scheduled_Post],
                offset: Number(desde),
                limit: Number(limite)
            })
        ]);

        res.json({
            total,
            posts,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Please talk to the admin'
        });
    }

}

const getPublishedPosts = async (req = request, res = response) => {

    try {

        const {userJWT} = req;

        const {desde = '0', limite = '10'} = req.query;

        const [total, posts] = await Promise.all([
            Post.count({
                where: {
                    user_id: userJWT.id,
                    state: true
                }
            }),
            Post.findAll({
                where: {
                    user_id: userJWT.id,
                    state: true
                },
                order: [
                    ['createdAt', 'DESC'],
                ],
                include: [Channel, Post_Type, Scheduled_Post],
                offset: Number(desde),
                limit: Number(limite)
            })
        ]);

        res.json({
            total,
            publishedPosts: posts,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Please talk to the admin'
        });
    }

}

const getPendingPosts = async (req = request, res = response) => {

    try {

        const {userJWT} = req;

        const {desde = '0', limite = '10'} = req.query;

        const [total, posts] = await Promise.all([
            Post.count({
                where: {
                    user_id: userJWT.id,
                    state: false
                }
            }),
            Post.findAll({
                where: {
                    user_id: userJWT.id,
                    state: false
                },
                order: [
                    ['createdAt', 'DESC'],
                ],
                include: [Channel, Post_Type, Scheduled_Post],
                offset: Number(desde),
                limit: Number(limite)
            })
        ]);

        res.json({
            total,
            pendingPosts: posts,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Please talk to the admin'
        });
    }

}

const getQueuedPosts = async (req = request, res = response) => {

    try {

        const {userJWT} = req;

        const {desde = '0', limite = '10'} = req.query;

        const post_type_queued = await Post_Type.findOne({
            where: {
                name: 'Queued',
                state: true
            }
        });

        const [total, posts] = await Promise.all([
            Post.count({
                where: {
                    user_id: userJWT.id,
                    state: false,
                    post_type_id: post_type_queued.id,
                }
            }),
            Post.findAll({
                where: {
                    user_id: userJWT.id,
                    state: false,
                    post_type_id: post_type_queued.id,
                },
                order: [
                    ['createdAt', 'DESC'],
                ],
                include: [Channel, Post_Type, Scheduled_Post],
                offset: Number(desde),
                limit: Number(limite)
            })
        ]);

        res.json({
            total,
            queuedPosts: posts,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Please talk to the admin'
        });
    }

}

const publishTwitter = async (accessToken, accessSecret, post) => {

    const client = new TwitterApi({
        appKey: process.env.TWITTER_CONSUMER_KEY,
        appSecret: process.env.TWITTER_CONSUMER_SECRET,
        accessToken,
        accessSecret,
    });

    client.v1.tweet(post).then((val) => {
        //console.log(val)
        //console.log("success")
    }).catch((err) => {
        //console.log(err)
    });

}

const publishLinkedIn = async (userId, accessToken, post) => {

    const url = 'https://api.linkedin.com/v2/ugcPosts';
    const body = {
        "author": "urn:li:person:"+userId,
        "lifecycleState": "PUBLISHED",
        "specificContent": {
            "com.linkedin.ugc.ShareContent": {
                "shareCommentary": {
                    "text": post
                },
                "shareMediaCategory": "NONE"
            }
        },
        "visibility": {
            "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
        }
    };
    const headers = {
        'Authorization': 'Bearer ' + accessToken,
        'cache-control': 'no-cache',
        'X-Restli-Protocol-Version': '2.0.0',
        'x-li-format': 'json'
    };

    const response = await new Promise((resolve, reject) => {
        requestApi.post({ url: url, json: body, headers: headers}, (err, response, body) => {
            if(err) {
                reject(err);
            }
            resolve(body);
        });
    });
    //console.log(response);

}

const createPost = async (req = request, res = response) => {

    try {

        const {userJWT, body} = req;

        const {post, ChannelIds, state, scheduledAt} = body;

        //console.log(ChannelIds);

        const connections = await Channels_Users.findAll({
            where: {
                UserId: userJWT.id,
                state: true
            },
        });

        if(!connections[0]) {
            return res.status(404).json({
                msg: `You need connections to publish`
            });
        }

        if(state === undefined || state){ //instant

            //PUBLICAR EL POST EN LAS REDES SOCIALES

            const post_type = await Post_Type.findOne({
                where: {
                    name: 'Instant',
                    state: true
                }
            });

            const newPost = await Post.create({
                post,
                user_id: userJWT.id,
                post_type_id: post_type.id,
            });

            ChannelIds.forEach(async (cId) => {
                const channel = await Channel.findByPk(cId);
                await newPost.addChannel(channel, { through: Posts_Channels });

                const connection = await Channels_Users.findOne({
                    where: {
                        ChannelId: cId,
                        UserId: userJWT.id,
                        state: true
                    }
                });
                if(channel.name === 'Twitter'){
                    if(connection){
                        await publishTwitter(connection.accessToken, connection.tokenSecret, post);
                    }
                }else if(channel.name === 'LinkedIn'){
                    if(connection){
                        await publishLinkedIn(connection.mediaId, connection.accessToken, post);
                    }
                }
            });

            res.json({
                newPost
            });

        }else if(!state && !scheduledAt){ //queued

            const schedules = await Schedule.findAll({
                where: {
                    user_id: userJWT.id,
                    state: true
                }
            });

            if(!schedules[0]) {
                return res.status(404).json({
                    msg: `You need schedules to create queued posts`
                });
            }
            
            const post_type = await Post_Type.findOne({
                where: {
                    name: 'Queued',
                    state: true
                }
            });

            const newPost = await Post.create({
                post,
                user_id: userJWT.id,
                post_type_id: post_type.id,
                state,
            });

            ChannelIds.forEach(async (cId) => {
                const channel = await Channel.findByPk(cId);
                await newPost.addChannel(channel, { through: Posts_Channels });
            });

            res.json({
                newPost
            });

        }else if(!state && scheduledAt){ //scheduled

            const currentDate = new Date();
            const scheduledDate = new Date(scheduledAt);

            if(scheduledDate < currentDate){
                return res.status(400).json({
                    msg: `You cant schedule a post for a past date`
                });
            }
            
            const post_type = await Post_Type.findOne({
                where: {
                    name: 'Scheduled',
                    state: true
                }
            });

            const newPost = await Post.create({
                post,
                user_id: userJWT.id,
                post_type_id: post_type.id,
                state,
            });

            ChannelIds.forEach(async (cId) => {
                const channel = await Channel.findByPk(cId);
                await newPost.addChannel(channel, { through: Posts_Channels });
            });

            const newScheduledPost = await Scheduled_Post.create({
                post_id: newPost.id,
                scheduledAt
            });

            res.json({
                newPost,
                newScheduledPost
            });

        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Please talk to the admin'
        });
    }
}

const updatePost = async (req = request, res = response) => {

    try {

        const {userJWT, body} = req;

        const {id} = req.params;

        const oldPost = await Post.findOne({
            where: {
                id,
                user_id: userJWT.id,
                state: false
            }
        });

        if(!oldPost){
            return res.status(404).json({
                msg: `There is no pending post with ID ${id}`
            });
        }
        
        const { post, scheduledAt } = req.body;

        await oldPost.update({post});

        if(scheduledAt){

            const oldScheduledPost = await Scheduled_Post.findOne({
                where: {
                    post_id: id,
                }
            });

            if(!oldScheduledPost){
                res.json({
                    post: oldPost
                });
            }

            await oldScheduledPost.update({scheduledAt});
            
            res.json({
                post: oldPost,
                scheduledPost: oldScheduledPost
            });

        }else{
            res.json({
                post: oldPost
            });
        }


    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Please talk to the admin'
        });
    }

}

const deletePost = async (req = request, res = response) => {

    try {

        const {userJWT} = req;

        const {id} = req.params;

        const post = await Post.findOne({
            where: {
                id,
                user_id: userJWT.id,
                state: false
            }
        });

        if(!post){
            return res.status(404).json({
                msg: `There is no pending post with ID ${id}`
            });
        }

        const oldScheduledPost = await Scheduled_Post.findOne({
            where: {
                post_id: id,
            }
        });

        if(oldScheduledPost){
            await oldScheduledPost.destroy();
        }

        await post.destroy();

        //await post.update({state: false});

        res.json({
            post
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Please talk to the admin'
        });
    }

}

module.exports = {
    getPosts,
    getPublishedPosts,
    getPendingPosts,
    getQueuedPosts,
    createPost,
    updatePost,
    deletePost,
    Publisher
}
