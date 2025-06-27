import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Post } from '../types/post';
import axios from 'axios';

export type PostFilters = {
  type?: string;
  direction?: string;
};

interface PostsState {
  posts: Post[];
  loading: boolean;
  error: string | null;
  filters: PostFilters;
}

const initialState: PostsState = {
  posts: [],
  loading: false,
  error: null,
  filters: {},
};

export const fetchPosts = createAsyncThunk<Post[], PostFilters>(
  'posts/fetchPosts',
  async (filters, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(filters as any).toString();
      const res = await axios.get(`/api/posts?${params}`, { withCredentials: true });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Ошибка загрузки постов');
    }
  }
);

export const createPost = createAsyncThunk<Post, Partial<Post>>(
  'posts/createPost',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post('/api/posts', data, { withCredentials: true });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Ошибка создания поста');
    }
  }
);

export const updatePost = createAsyncThunk<Post, { id: string; data: Partial<Post> }>(
  'posts/updatePost',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`/api/posts/${id}`, data, { withCredentials: true });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Ошибка обновления поста');
    }
  }
);

export const deletePost = createAsyncThunk<string, string>(
  'posts/deletePost',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/posts/${id}`, { withCredentials: true });
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Ошибка удаления поста');
    }
  }
);

export const likePost = createAsyncThunk<{ id: string; likes: number }, string>(
  'posts/likePost',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.post(`/api/posts/${id}/like`, {}, { withCredentials: true });
      return { id, likes: res.data.likes };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Ошибка лайка');
    }
  }
);

export const unlikePost = createAsyncThunk<{ id: string; likes: number }, string>(
  'posts/unlikePost',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`/api/posts/${id}/like`, { withCredentials: true });
      return { id, likes: res.data.likes };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Ошибка удаления лайка');
    }
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<PostFilters>) {
      state.filters = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.posts = [];
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const idx = state.posts.findIndex(p => p.id === action.payload.id);
        if (idx !== -1) state.posts[idx] = action.payload;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(p => p.id !== action.payload);
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const idx = state.posts.findIndex(p => p.id === action.payload.id);
        if (idx !== -1) {
          state.posts[idx].likes = action.payload.likes;
          state.posts[idx].isLikedByUser = true;
        }
      })
      .addCase(unlikePost.fulfilled, (state, action) => {
        const idx = state.posts.findIndex(p => p.id === action.payload.id);
        if (idx !== -1) {
          state.posts[idx].likes = action.payload.likes;
          state.posts[idx].isLikedByUser = false;
        }
      });
  },
});

export const { setFilters } = postsSlice.actions;
export default postsSlice.reducer; 