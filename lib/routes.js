Router.configure({
  loadingTemplate: 'loading'
});

Router.route('/', { name: 'dashboard' });
Router.route('/admin', { name: 'adminPanel' });

// MainController = RouteController.extend({
//   action: function() {
//   	// this.render('main', {
// 	  //   data: function () {
// 	  //     return Event.find()
// 	  //   }
//   	// });
//   }
// });