const isTeacher = (req,res) => {
    if(req.isAuthenticated()){
      return req.user.role === 'teacher';
    }
    else res.redirect('/auth/login');
  }

  const ensureTeacher = (req,res,next) => {
    if(req.isAuthenticated() && req.user.role === 'teacher'){
     return next();
    } else return res.redirect('/auth/login');
  }

module.exports = {
  isTeacher,
  ensureTeacher,
};