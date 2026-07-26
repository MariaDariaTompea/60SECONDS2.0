module.exports = (sequelize, DataTypes) => {
    const Users = require("./users")(sequelize, DataTypes);
    const characterItem = require("./characterItem")(sequelize, DataTypes);
    const News = require("./news")(sequelize, DataTypes);
    const community_posts = require("./community_posts")(sequelize, DataTypes);
    const community_likes = require("./community_likes")(sequelize, DataTypes);
    const community_comments = require("./community_comments")(sequelize, DataTypes);

    community_posts.belongsTo(Users, { foreignKey: 'user_id' })
    community_posts.hasMany(community_comments, { foreignKey: 'post_id' })

    community_comments.belongsTo(Users, { foreignKey: 'user_id' })
    community_comments.belongsTo(community_posts, { foreignKey: 'post_id' })
    community_comments.belongsTo(community_comments, { as: 'parent', foreignKey: 'parent_comment_id' })
    community_comments.hasMany(community_comments, { as: 'replies', foreignKey: 'parent_comment_id' })

    Users.hasMany(community_posts, { foreignKey: 'user_id' })
    Users.hasMany(community_comments, { foreignKey: 'user_id' })

    community_likes.belongsTo(Users, { foreignKey: 'user_id' })
    Users.hasMany(community_likes, { foreignKey: 'user_id' })
    community_likes.belongsTo(community_posts, { foreignKey: 'entity_id', constraints: false })
    community_likes.belongsTo(community_comments, { foreignKey: 'entity_id', constraints: false })

    return {
        Users,
        characterItem,
        News,
        community_posts,
        community_likes,
        community_comments
    }
}
