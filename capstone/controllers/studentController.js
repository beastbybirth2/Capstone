const isStudent = (req,res) => {
    if(req.isAuthenticated()){
      return req.user.role === 'student';
    }
    else res.redirect('/auth/login');
  }

const ensureStudent = (req,res,next) => {
  if(req.isAuthenticated() && req.user.role === 'student'){
   return next();
  } else return res.redirect('/auth/login');
}
module.exports = {
  isStudent,
  ensureStudent,
};