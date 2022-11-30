const express = require('express');
const path = require('path');
const cors = require('cors');
const {db} = require('../db/connection');
const cookieParser = require("cookie-parser");

const passport = require("passport");
const LinkedInOAuth = require("passport-linkedin-oauth2");
const Strategy = require('passport-twitter');
const session = require('express-session');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT || '4000';
        this.paths = {
            users: '/api/users',
            schedules: '/api/schedules',
            seed: '/api/seed',
            channels: '/api/channels',
            postTypes: '/api/postTypes',
            connections: '/api/connections',
            posts: '/api/posts',
        }
        this.dbConnection();
        this.middlewares();
        this.routes();
    }

    async dbConnection() {
        try {
            
            await db.authenticate();
            console.log('Postgres DB Connection has been established successfully');
            
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    }

    middlewares() {
        
        this.app.use(cors({
            origin: ['https://social-hub21.herokuapp.com'],
            //origin: ['http://localhost:3000'],
            credentials:true,
            exposedHeaders: ["token"],
        }));

        passport.serializeUser((user, done) => {
            //console.log('serialize');
            done(null, user);
          });
        passport.deserializeUser((user, done) => {
            //console.log('deserialize');
            done(null, user);
        });

        this.app.use(session({ secret: process.env.SESSION_SECRET}));
        this.app.use(passport.initialize());
        this.app.use(passport.session());

        this.app.use(express.json());
        //this.app.use(express.urlencoded({ extended: false }));
        this.app.use(cookieParser());
        this.app.use(express.static('public'));

        const LinkedInStrategy=LinkedInOAuth.Strategy
        const LINKEDIN_CLIENTID = process.env.LINKEDIN_CLIENT_ID;
        const LINKEDIN_CLIENTSECRET = process.env.LINKEDIN_CLIENT_SECRET;
        const LINKEDIN_STRATEGY_OBJECT= {
        clientID: LINKEDIN_CLIENTID,
        clientSecret: LINKEDIN_CLIENTSECRET,
        callbackURL: `https://social-hub21.herokuapp.com/api/connections/auth/linkedin/callback`,
        //callbackURL: `http://localhost:${this.port}/api/connections/auth/linkedin/callback`,
        scope: ["r_emailaddress", "r_liteprofile", "w_member_social"],
        }

        passport.use(
        new LinkedInStrategy(LINKEDIN_STRATEGY_OBJECT,
            (
            accessToken,     
            refreshToken,
            profile,
            done,
            ) => {
            process.nextTick(() => {
                // console.log(accessToken);
                // console.log(profile.displayName);
                // console.log(profile.photos[0].value);
                return done(null, {mediaId: profile.id, accessToken, username: profile.displayName, photo: profile.photos[0].value});
            });
            }
        ));

        passport.use(new Strategy({
            consumerKey: process.env['TWITTER_CONSUMER_KEY'],
            consumerSecret: process.env['TWITTER_CONSUMER_SECRET'],
            callbackURL: `https://social-hub21.herokuapp.com/api/connections/auth/twitter/callback`,
            //callbackURL: `http://localhost:${this.port}/api/connections/auth/twitter/callback`,
            //proxy: trustProxy
          },
          function(token, tokenSecret, profile, done) {
            // console.log(token);
            // console.log(tokenSecret);
            // console.log(profile.username);
            // console.log(profile.photos[0].value);
            return done(null, {mediaId: profile.id, accessToken: token, tokenSecret, username: profile.username, photo: profile.photos[0].value});
          }));
    }

    routes() {
        this.app.use(this.paths.users, require('../routes/users.router'));
        this.app.use(this.paths.schedules, require('../routes/schedules.router'));
        this.app.use(this.paths.seed, require('../routes/seed.router'));
        this.app.use(this.paths.channels, require('../routes/channels.router'));
        this.app.use(this.paths.postTypes, require('../routes/postTypes.router'));
        this.app.use(this.paths.connections, require('../routes/connections.router'));
        this.app.use(this.paths.posts, require('../routes/posts.router'));
        this.app.get('*', (req, res) => {
            //console.log(__dirname.substring(0, __dirname.length-11));
            res.sendFile( __dirname.substring(0, __dirname.length-11) + '/public/index.html'); //sin /src y models
        })
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`REST Server listening on port ${this.port}`)
        });
    }

}

module.exports = Server;