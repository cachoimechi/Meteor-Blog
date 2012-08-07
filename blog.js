Posts = new Meteor.Collection('posts');

if (Meteor.is_client) {
  /**
   * Templates
   */
  
    //Header

    //Editor

    Template.editor.events = {
      'click #submit_post': function () {
        var title = $('#editor .title').val(),
            currentTime = new Date(),
            month = currentTime.getMonth() + 1,
            day = currentTime.getDate(),
            year = currentTime.getFullYear(),
            date = month + "-" + day + "-" + year,
            content = $('#editor .content').val();
        Posts.insert({title: title, date: date, content: content});
        $('#editor').slideUp('slow');
        $('#add_post').show();
      },
      'click #add_post': function (event) {
        event.preventDefault();
        $('#editor').slideDown('slow');
        $('#add_post').hide();
      },
      'click #cancel_post': function (event) {
        event.preventDefault();
        $("#editor").slideUp('slow');
        $('#add_post').show();
      }
    };

    //Posts
    
    Template.posts.one_post = function () {
      return !Session.equals('post_id', undefined);
    }

    Template.posts.is_admin = function () {
      return Session.equals('is_admin', true);
    }

    Template.posts.posts = function () {
      return Posts.find({}, {sort: {_id: 1}});
    };

    Template.posts.events = {
      /*'mousedown .post': function (evt) {
        Router.setPost(this._id);
      },*/
      'click .update_post': function (event) {
        var target = event.currentTarget,
            id = $(target).parent().attr('id'),
            title = $(target).siblings('.title').text(),
            date = $(target).siblings('h2').find('.date').text(),
            content = $(target).siblings('.content').text();
        Posts.update({_id: id}, {title: title, date: date, content: content});
      },
      'click .delete_post': function (event) {
        var target = event.currentTarget,
            id = $(target).parent().attr('id'),
            title = $(target).siblings('.title').text(),
            confirm = window.confirm("Delete post: " + title + "?");
        if (confirm) {
            Posts.remove(id);
        }
      }
    };

    Template.single_post.is_admin = function () {
      return Session.equals('is_admin', true);
    }

    Template.single_post.id = function () {
      var post = Posts.findOne(Session.get('post_id'));
      return post && post._id;
    }

    Template.single_post.title = function () {
      var post = Posts.findOne(Session.get('post_id'));
      return post && post.title;
    };

    Template.single_post.date = function () {
      var post = Posts.findOne(Session.get('post_id'));
      return post && post.date;
    };

    Template.single_post.content = function () {
      var post = Posts.findOne(Session.get('post_id'));
      return post && post.content;
    };

    //Sidebar

    Template.sidebar.posts = function () {
      var posts = Posts.find({}, {sort: {_id: 1}}).fetch();
      return posts.slice(0, 5);
    }

    //Footer

    /**
     * Routers
     */

    var BlogRouter = Backbone.Router.extend({
      routes: {
        "admin": "admin",
        "admin/:post_id": "admin_post",
        ":post_id": "main"
      },
      admin: function () {
        Session.set('is_admin', true);
      },
      admin_post: function (post_id) {
        Session.set('post_id', post_id);
        Session.set('is_admin', true);
      },
      main: function (post_id) {
        Session.set('post_id', post_id);
        Session.set('is_admin', false);
      }
    });

    Router = new BlogRouter;

    Meteor.startup(function () {

      Backbone.history.start({pushState: true});
    });

}

/**
 * Server
 */

if (Meteor.is_server) {
  
}