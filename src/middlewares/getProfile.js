
const getProfile = async (req, res, next) => {
    const { Profile } = req.app.get('models');
    const profileId = req.headers.profile_id; // Assuming the profile ID is in the headers
  
    try {
      // Check if the profile ID exists and retrieve the corresponding profile
      const profile = await Profile.findOne({ where: { id: profileId } });
  
      if (!profile) {
        return res.status(401).json({ error: 'Invalid profile ID or profile not found.' });
      }
  
      // Attach the profile to the request object for later use in the route handler
      req.profile = profile;
      next();
    } catch (error) {
      console.error('Error fetching profile:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };
module.exports = {getProfile}