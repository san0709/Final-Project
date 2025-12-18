import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const EditProfile = () => {
    const { user, updateProfile } = useAuth();
    const navigate = useNavigate();

    const [fullName, setFullName] = useState(user.fullName || '');
    const [bio, setBio] = useState(user.bio || '');
    const [location, setLocation] = useState(user.location || '');
    const [website, setWebsite] = useState(user.website || '');

    const [profilePic, setProfilePic] = useState(null);
    const [coverPhoto, setCoverPhoto] = useState(null);

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('fullName', fullName);
            formData.append('bio', bio);
            formData.append('location', location);
            formData.append('website', website);

            if (profilePic) formData.append('profilePicture', profilePic);
            if (coverPhoto) formData.append('coverPhoto', coverPhoto);

            const { data } = await api.put('/users/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            updateProfile(data);
            navigate(`/profile/${data.username}`);
        } catch (err) {
            alert('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Cover Photo */}
                <div>
                    <label className="block font-medium mb-1">Cover Photo</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setCoverPhoto(e.target.files[0])}
                    />
                </div>

                {/* Profile Picture */}
                <div>
                    <label className="block font-medium mb-1">Profile Picture</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setProfilePic(e.target.files[0])}
                    />
                </div>

                {/* Full Name */}
                <div>
                    <label className="block font-medium mb-1">Full Name</label>
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full border rounded p-2"
                        required
                    />
                </div>

                {/* Bio */}
                <div>
                    <label className="block font-medium mb-1">Bio</label>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full border rounded p-2"
                        rows="3"
                    />
                </div>

                {/* Location */}
                <div>
                    <label className="block font-medium mb-1">Location</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full border rounded p-2"
                    />
                </div>

                {/* Website */}
                <div>
                    <label className="block font-medium mb-1">Website</label>
                    <input
                        type="url"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        className="w-full border rounded p-2"
                    />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 border rounded"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProfile;
