exports.index = function(req, res){
  if (req.path !== '/soon') {
    res.redirect('/soon');
  }
  res.render('index', { title: 'Express' });
};
