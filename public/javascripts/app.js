(function() {
  var Account = Backbone.Model.extend({
    url: '/accounts'
  });

  var SuccessView = Backbone.View.extend({
    template: JST['success.hbs'],
    events: {
      'click .popup': 'share'
    },

    initialize: function() {
      this.render();
    },

    render: function() {
      this.$el.html(this.template({
        firstName: this.model.get('name').split(' ')[0]
      }));
    },

    share: function(e) {
      var width  = 575,
          height = 400,
          left   = ($(window).width()  - width)  / 2,
          top    = ($(window).height() - height) / 2,
          url    = $(e.currentTarget).attr('href'),
          opts   = 'status=1' +
                   ',width='  + width  +
                   ',height=' + height +
                   ',top='    + top    +
                   ',left='   + left;


      var windowName;
      if ($(e.currentTarget).hasClass('twitter')) {
        windowName = 'twitter';
      } else {
        windowName = 'facebook';
      }
      window.open(url, 'windowName', opts);

      return false;
    }
  });

  var ErrorView = Backbone.View.extend({
    template: JST['error.hbs'],

    initialize: function() {
      this.render();
    },

    render: function() {
      this.$el.html(this.template({
        dupe: (this.options.status === 400)
      }));
    }
  });

  var SignupView = Backbone.View.extend({
    events: {
      'submit': 'submit'
    },

    submit: function(e) {
      var name = this.$el.find('#name').val(),
          email = this.$el.find('#email').val();

      if (name && email) {
        var account = new Account({
          name: name,
          email: email
        });

        account.save()
        // .done(_.bind(this.showSuccess, this, account))
        // .fail(_.bind(this.showError, this));

        this.showSuccess(account);
      } else {
        analytics.track('Signup: form error');
      }

      return false;
    },

    showSuccess: function(account) {
      var $signup = $('#signup');
      $signup.addClass('fade-out');

      analytics.track('Signup: success', account.toJSON());

      setTimeout(function() {
        $signup.hide();
        new SuccessView({
          el: '#response',
          model: account
        });
      }, 300);
    },

    showError: function(resp) {
      analytics.track('Signup: server error', {
        dupe: (resp.status === 400),
        status: resp.status
      });

      new ErrorView({
        el: '#response',
        status: resp.status
      });
    }
  });

  new SignupView({
    el: '#signup'
  });
}());
