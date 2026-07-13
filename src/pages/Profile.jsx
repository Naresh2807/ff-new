import React, { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../api/api';
import { Link } from 'react-router-dom';
import { User, Mail, Edit2, Camera, Calendar, BookOpen, Heart } from 'lucide-react';
import RecipeCard from '../components/RecipeCard';
import Loader from '../components/Loader';
import { getFullImageUrl, PLACEHOLDER_IMAGE } from '../utils/imageUtils';

function Profile({ user, setUser }) {
  const [profile, setProfile] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', bio: '' });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  const fetchProfile = async () => {
    try {
      const data = await getProfile();
      // data is the response body (interceptor returns data directly)
      const userData = data.user || data; // both shapes: { user, recipes } or just the user
      const recipesData = data.recipes || [];
      setProfile(userData);
      setRecipes(recipesData);
      setFormData({
        name: userData.name || '',
        bio: userData.bio || ''
      });
      if (userData.profileImage) {
        setImagePreview(getFullImageUrl(userData.profileImage) || PLACEHOLDER_IMAGE);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfileImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError('');
    try {
      let payload;
      if (profileImage) {
        payload = new FormData();
        payload.append('name', formData.name);
        payload.append('bio', formData.bio);
        payload.append('profileImage', profileImage);
      } else {
        payload = {
          name: formData.name,
          bio: formData.bio
        };
      }

      const updatedUser = await updateProfile(payload);
      const newUser = updatedUser.user || updatedUser;
      setProfile(newUser);
      setUser(newUser);
      setEditing(false);
      setProfileImage(null);
      await fetchProfile(); // refresh recipes too
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Loader fullScreen />;
  if (!profile) return <div className="text-center py-8 text-red-500">Profile not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-orange-400 h-32" />
        <div className="px-6 pb-6 relative">
          <div className="flex flex-col md:flex-row items-start md:items-end -mt-16">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-lg">
                {imagePreview ? (
                  <img src={imagePreview} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                    <User className="w-16 h-16 text-primary" />
                  </div>
                )}
              </div>
              {editing && (
                <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-orange-600 transition-colors">
                  <Camera className="w-4 h-4" />
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              )}
            </div>

            <div className="mt-4 md:mt-0 md:ml-6 flex-1">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="text-2xl font-bold text-gray-800 input-field"
                      required
                    />
                  ) : (
                    <h1 className="text-2xl font-bold text-gray-800">{profile.name}</h1>
                  )}
                  <div className="flex items-center space-x-2 text-gray-500 mt-1">
                    <Mail className="w-4 h-4" />
                    <span>{profile.email}</span>
                  </div>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {new Date(profile.createdAt).toLocaleDateString()}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{recipes.length} recipes</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Heart className="w-4 h-4" />
                      <span>{profile.favorites?.length || 0} favorites</span>
                    </span>
                  </div>
                </div>
                {!editing ? (
                  <button onClick={() => setEditing(true)} className="btn-outline flex items-center space-x-2">
                    <Edit2 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setEditing(false);
                        setFormData({ name: profile.name, bio: profile.bio });
                        setImagePreview(profile.profileImage ? getFullImageUrl(profile.profileImage) : '');
                        setProfileImage(null);
                        setError('');
                      }}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button onClick={handleUpdate} disabled={updating} className="btn-primary flex items-center space-x-2">
                      {updating ? <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white" /> : <span>Save</span>}
                    </button>
                  </div>
                )}
              </div>

              {editing ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full mt-3 input-field resize-y"
                  rows="3"
                  placeholder="Tell us about yourself..."
                />
              ) : profile.bio ? (
                <p className="mt-3 text-gray-600">{profile.bio}</p>
              ) : (
                <p className="mt-3 text-gray-400 italic">No bio yet</p>
              )}
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Recipes</h2>
        {recipes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <p className="text-4xl mb-4">🍳</p>
            <p className="text-gray-500">You haven't created any recipes yet</p>
            <Link to="/add-recipe" className="btn-primary inline-block mt-4">
              Create Your First Recipe
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;