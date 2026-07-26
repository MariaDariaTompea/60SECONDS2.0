const characterService = require("../services/characterService");

require("dotenv").config();

exports.getAllCharacter = async (req, res, next) => {
    const search = req.query.search || ''
    try{
        const characters = await characterService.getAllCharacter(search);

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

exports.getCharacter = async (req, res, next) => {
    const { id } = req.params;
    
    try{
        const characters = await characterService.getCharacter(id);

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

exports.getNames = async (req, res, next) => {
    try{
        const names = await characterService.getNames();

        if(!names){
            const error = new Error("Nem sikerült lekérni a karatereket!");

            error.status = 400;

            throw error;
        }

        res.status(200).json(names);
    }catch(error){
        next(error);
    }
}