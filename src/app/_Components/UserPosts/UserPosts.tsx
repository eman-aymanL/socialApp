'use client';
import React, { useEffect, useState } from 'react';
import {Box,CircularProgress,Typography,Card,CardHeader,CardContent,Avatar,IconButton,Menu,MenuItem,TextField,Button,} from '@mui/material';
import Cookies from 'js-cookie';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Comments from '../Comments/Comments';
interface UserPostType {
  _id: string;
  body?: string;
  image?: string;
  createdAt: string;
  user: {
    _id: string;
    name: string;
    photo: string;
  };
  comments?: any[];
}
type Props = {
  refreshTrigger?: any;
};
type PostProps = {
  postDetails: UserPostType;
  onUpdate: (postId: string, newBody: string) => void;
  onDelete: (postId: string) => void;
};
function Post({ postDetails, onUpdate, onDelete }: PostProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBody, setEditedBody] = useState(postDetails.body || '');

  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleEditClick = () => {
    setIsEditing(true);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    if (confirm('Are you sure you want to delete this post?')) {
      onDelete(postDetails._id);
    }
  };

  const handleSaveClick = () => {
    if (editedBody.trim() === '') {
      alert('Post body cannot be empty.');
      return;
    }
    onUpdate(postDetails._id, editedBody.trim());
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setEditedBody(postDetails.body || '');
    setIsEditing(false);
  };

  return (
    <Card
      sx={{width: '100%',maxWidth: 900,borderRadius: 4,boxShadow: 4,backgroundColor: '#fff',border: '1px solid #eee',}}>
      <CardHeader
        avatar={<Avatar src={postDetails.user.photo} alt={postDetails.user.name} />}
        action={
          <>
            <IconButton onClick={handleMenuOpen}>
              <MoreVertIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
              <MenuItem onClick={handleEditClick}>Update</MenuItem>
              <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
            </Menu>
          </>
        }
        title={<Typography fontWeight="bold">{postDetails.user.name}</Typography>}
        subheader={
          <Typography fontSize={13} color="text.secondary">
            {new Date(postDetails.createdAt).toLocaleString()}
          </Typography>
        }
        sx={{ alignItems: 'flex-start', pb: 1, backgroundColor: '#f9f9f9', borderTopLeftRadius: 16, borderTopRightRadius: 16,
        }}
      />
      <CardContent sx={{ pt: 0 }}>
        {isEditing ? (
          <>
            <TextField fullWidth multiline minRows={3} value={editedBody} onChange={(e) => setEditedBody(e.target.value)} sx={{ mb: 1 }}/>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="contained" onClick={handleSaveClick} sx={{ bgcolor: '#8E44AD' }}>
                Save
              </Button>
              <Button variant="outlined" onClick={handleCancelClick}>
                Cancel
              </Button>
            </Box>
          </>
        ) : (
          <Typography variant="body1" sx={{ mb: 1 }}>{postDetails.body}</Typography>
        )}
        {postDetails.image && (<Box component="img" src={postDetails.image} alt="post" sx={{   width: '100%',   maxHeight: 400,   objectFit: 'cover',   borderRadius: 2,   mb: 1, }}/>
        )}
<Comments postDetails={postDetails} displayAllComments />
      </CardContent>
    </Card>
  );
}
export default function UserPosts({ refreshTrigger }: Props) {
  const [userPosts, setUserPosts] = useState<UserPostType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserPosts = async () => {
    try {
      setLoading(true);
      const token = Cookies.get('userToken');

      const profileRes = await fetch('https://linked-posts.routemisr.com/users/profile-data', {
        headers: { token: token || '' },
      });
      const profileData = await profileRes.json();
      const userId = profileData.user._id;

      const postsRes = await fetch(
        `https://linked-posts.routemisr.com/users/${userId}/posts?limit=30`,
        {
          headers: { token: token || '' },
          cache: 'no-store',
        }
      );

      const postsData = await postsRes.json();
      const sortedPosts = (postsData.posts || []).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setUserPosts(sortedPosts);
    } catch (err) {
      console.error('Error fetching user posts:', err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUserPosts();
  }, [refreshTrigger]);

  const handleUpdatePost = async (postId: string, newBody: string) => {
    const token = Cookies.get('userToken');
    const formData = new FormData();
    formData.append('body', newBody);

    try {
      const res = await fetch(`https://linked-posts.routemisr.com/posts/${postId}`, {
        method: 'PUT',
        headers: {
          token: token || '',
        },
        body: formData,
      });
const data = await res.json();
      if (data.message === 'success') {
        setUserPosts((prev) =>
          prev.map((post) => (post._id === postId ? { ...post, body: newBody } : post))
        );
      } else {
        alert('Update failed');
      }
    } catch (err) {
      console.error(err);
    }
  };
 const handleDeletePost = async (postId: string) => {
    const token = Cookies.get('userToken');
    try {
      const res = await fetch(`https://linked-posts.routemisr.com/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          token: token || '',
        },
      });

      const data = await res.json();

      if (data.message === 'success') {
        setUserPosts((prev) => prev.filter((post) => post._id !== postId));
      } else {
        alert('Delete failed');
      }
    } catch (err) {
      console.error(err);
    }
  };
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress sx={{ color: '#8E44AD' }} />
      </Box>
    );
  }
if (userPosts.length === 0) {
    return (
      <Typography textAlign="center" mt={4} color="text.secondary">
        You haven't created any posts yet.
      </Typography>
    );
  }
  return (
    <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
      {userPosts.map((post) => (
        <Box key={post._id} sx={{ width: '100%', maxWidth: 900 }}>
          <Post postDetails={post} onUpdate={handleUpdatePost} onDelete={handleDeletePost} />
        </Box>
      ))}
    </Box>
  );
}
