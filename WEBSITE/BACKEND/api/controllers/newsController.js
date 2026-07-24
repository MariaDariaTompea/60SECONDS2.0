const newsService = require("../services/newsService");

require("dotenv").config();

exports.getNews = async (req, res, next) => {
     try{
        const characters = await newsService.getNews();

        if(!characters){
            const error = new Error("Nem sikerült lekérni az itemeket!");

            error.status = 400;

            throw error;
        }

        res.status(200).json(characters);
    }catch(error){
        next(error);
    }
};

exports.getAllNews = async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const search = req.query.search || ''
    try{
        const characters = await newsService.getAllNews(limit, offset, search);

        if(!characters){
            const error = new Error("Nem sikerült lekérni az itemeket!");

            error.status = 400;

            throw error;
        }

        res.status(200).json(characters);
    }catch(error){
        next(error);
    }
};