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
      'click #add_post': function () {
        $('#editor').slideDown('slow');
        $('#add_post').hide();
      },
      'click #cancel_post': function () {
        $("#editor").slideUp('slow');
        $('#add_post').show();
      }
    };

    //Posts

    Template.posts.posts = function () {
      return Posts.find({}, {sort: {_id: 1}});
    };

    Template.posts.events = {
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

    //Sidebar

    Template.sidebar.posts = function () {
      var posts = Posts.find({}, {sort: {_id: 1}}).fetch();
      return posts.slice(0, 5);
    }

    //Footer
}

if (Meteor.is_server) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}