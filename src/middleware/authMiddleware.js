export function isAuthenticated(req, res, next) {
    if (req.session?.user) {
      return next(); // logged-in users
    }
    res.redirect('/'); // redirect guests to login
  }
  
  export function isGuest(req, res, next) {
    if (!req.session?.user) {
      return next(); // guests
    }
    res.redirect('/'); // logged-in users go to home
  }
  
  export function isOwner(getResource) {
    return async (req, res, next) => {
      try {
        const resource = await getResource(req.params.id);
        if (!resource) {
          return res.status(404).render('404');
        }
  
        if (resource.owner.toString() !== req.session.user._id) {
          return res.status(403).send('Forbidden');
        }
  
        req.resource = resource;
        next();
      } catch (err) {
        next(err);
      }
    };
  }
  