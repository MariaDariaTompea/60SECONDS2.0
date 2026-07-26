const itemService = require("../services/itemService");

require("dotenv").config();

exports.getAllItem = async (req, res, next) => {
    const search = req.query.search || ''
    try{
        const characters = await itemService.getAllItem(search);

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

exports.getItem = async (req, res, next) => {
    const { id } = req.params;
    
    try{
        const characters = await itemService.getItem(id);

        if(!characters){
            const error = new Error("Nem sikerült lekérni a karatereket!");

            error.status = 400;

            throw error;
        }

        res.status(200).json(characters);
    }catch(error){
        next(error);
    }
};