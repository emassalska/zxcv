//blabla

Meteor.publish("posts",function(userid){
	return Posts.find({});
})
Meteor.publish("likes",function(){
	return Likes.find();
})
Meteor.publish("appusers",function(){
	return Meteor.users.find({_id: this.user});
})

Meteor.methods({
	//{text:'',owner:'',date:'',parent:''}
	'addPost':function(options){
		var post = {
			text:options.text,
			//owner:Meteor.user().emails[0].address,
			date:new Date(),
			parent:options.parent,
		}
		Posts.insert(post);
		
	},
	'addLike' : function(opts) {
		Likes.insert(opts);
	},
	'removePost':function(id){
		Posts.remove({_id:id});
	},
	'removeAllPosts':function(){
		Posts.remove({});
	},
	'removeAllLikes':function(){
		Likes.remove({});
	},
	'addNames':function(){

	}
})
