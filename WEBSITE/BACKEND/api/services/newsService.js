const newsRepository  = require("../repositories/newsRepository");

class newsService
{
    async getNews()
    {
        return await newsRepository.getNews();
    }

    async getAllNews(limit, offset, search)
    {
        return await newsRepository.getAllNews(limit, offset, search);
    }
}

module.exports = new newsService();