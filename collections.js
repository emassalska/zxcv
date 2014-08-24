Posts = new Meteor.Collection('posts');
Likes = new Meteor.Collection('likes');

/* ONLY FOR DEBUG/TESTING PURPOUSES */
Likes.allow({
    insert : function(userID)
    {
        return true;
    },
    update : function(userID)
    {
        return true;
    },
    remove : function(userID)
    {
        return true;
    }
});


Posts.allow({
    insert : function(userID)
    {
        return true;
    },
    update : function(userID)
    {
        return true;
    },
    remove : function(userID)
    {
        return true;
    }
});
