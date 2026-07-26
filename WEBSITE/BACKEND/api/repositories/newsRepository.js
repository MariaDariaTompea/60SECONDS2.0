const db = require("../database/dbContext");

class newsRepository
{
    constructor(db)
    {
        this.News = db.News;
    }

    async getNews()
    {
        const options = {
            order: [['createdAt', 'DESC']],
            attributes: ['id', 'title', 'excerpt', 'createdAt', 'updatedAt'],
            limit: 2,
        };

        const news = await db.News.findAll(options);

        return news;
    }

    async getAllNews(limit, offset, search)
    {
        const { Op } = require('sequelize')
        const options = {
            order: [['createdAt', 'DESC']],
            limit,
            offset,
        }

        if (search) {
            options.where = {
            title: { [Op.like]: `%${search}%` }
            }
        }
        
        const { rows, count } = await db.News.findAndCountAll(options)

        const result = rows.map(item => {
            const plain = item.toJSON();
            if (typeof plain.content === 'string') {
            plain.content = JSON.parse(plain.content);
            }
            return plain;
        });
  
        return { news: result, total: count }
    }
}

module.exports = new newsRepository(db);