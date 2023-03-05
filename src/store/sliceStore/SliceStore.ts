import {
  AsyncThunk,
  createAsyncThunk,
  createSlice,
  current,
  PayloadAction,
} from "@reduxjs/toolkit";
import { Post } from "../../types/type.post";
import http from "../../utils/http";
type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>;

type PendingAction = ReturnType<GenericAsyncThunk["pending"]>;
type RejectedAction = ReturnType<GenericAsyncThunk["rejected"]>;
type FulfilledAction = ReturnType<GenericAsyncThunk["fulfilled"]>;
interface BlogState {
  postList: Post[];
  editingPost: Post | null;
  loading: boolean;
  currentRequestId: undefined | string;
}
const initialState: BlogState = {
  postList: [],
  editingPost: null,
  loading: false,
  currentRequestId: undefined,
};
export const getPostList = createAsyncThunk(
  "blog/getPostList",
  async (_, thunkAPI) => {
    //_ nếu k có tham số
    const response = await http.get<Post[]>("posts", {
      signal: thunkAPI.signal,
    });
    return response.data;
  }
);
export const addPost = createAsyncThunk(
  "blog/addPost",
  async (body: Omit<Post, "id">, thunkAPI) => {
    const response = await http.post<Post>("posts", body, {
      signal: thunkAPI.signal,
    });
    return response.data;
  }
);
export const updatePost = createAsyncThunk(
  "blog/updatePost",
  async ({ postId, body }: { postId: string; body: Post }, thunkAPI) => {
    try {
      const response = await http.put<Post>(`posts/${postId}`, body, {
        signal: thunkAPI.signal,
      });
      return response.data;
    } catch (error: any) {
      if(error.name === "AxiosError" && error.response.status === 422){
        return thunkAPI.rejectWithValue(error.response.data)
      }
      throw error;
    }
  }
);
export const deletePost = createAsyncThunk(
  "blog/deletePost",
  async (postId: string, thunkAPI) => {
    const response = await http.delete<Post>(`posts/${postId}`, {
      signal: thunkAPI.signal,
    });
    return response.data;
  }
);

const BlogSlice = createSlice({
  name: "blog",
  initialState: initialState,
  reducers: {
    editPost: (state, action: PayloadAction<string>) => {
      const idPost = action.payload;
      const dataEdit = state.postList.find((post) => post.id === idPost);
      state.editingPost = dataEdit || null;
    },
    cancelEditingPost: (state) => {
      state.editingPost = null;
    },
    // updatePost: (state, action: PayloadAction<Post>) => {
    //   const dataEdit = action.payload;
    //   state.postList.map((item, index) => {
    //     if (item.id === dataEdit.id) {
    //      return  state.postList[index] = dataEdit;
    //     }
    //     return item;
    //   });
    //   state.editingPost = null;
    // },
    // addItem: {
    //   reducer: (state, action : PayloadAction<Post>) => {
    //     const post = action.payload;
    //     state.postList.push(post);
    //   },
    //   prepare :(post : Omit<Post ,'id'>)=>{ // chỉnh sửa id trong payload
    //      return {
    //        payload : {
    //          ...post,
    //          id : nanoid()
    //        }
    //      }
    //   }
    // } ,
  },
  // when run into addmatcher is not into defaultCase
  extraReducers(builder) {
    builder
      .addCase(getPostList.fulfilled, (state, action) => {
        state.postList = action.payload;
      })
      .addCase(addPost.fulfilled, (state, action) => {
        const post = action.payload;
        state.postList.push(post);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const dataEdit = action.payload;
        state.postList.map((item, index) => {
          if (item.id === dataEdit.id) {
            return (state.postList[index] = dataEdit);
          }
          return item;
        });
        state.editingPost = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        const idDelete = action.meta.arg;
        console.log(action);
        const indexDelete = state.postList.findIndex(
          (item) => item.id === idDelete
        );
        if (indexDelete !== -1) {
          state.postList.splice(indexDelete, 1);
        }
        console.log(current(state));
      });
    builder
      .addMatcher<PendingAction>(
        (action) => action.type.endsWith("/pending"),
        (state, action) => {
          // khi pending state loading là true
          // requestId sinh ra khi call api thì createActhunk tạo ra 1 requestId duy nhất k trùng nhau
          state.loading = true;
          state.currentRequestId = action.meta.requestId
        }
      ).addMatcher<RejectedAction>(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          if(state.loading && state.currentRequestId === action.meta.requestId) {
            state.loading = false;
            state.currentRequestId = undefined;
          }
        }
      ).addMatcher<FulfilledAction>(
        (action) => action.type.endsWith("/fulfilled"),
        (state, action) => {
          if(state.loading && state.currentRequestId === action.meta.requestId) {
            state.loading = false;
            state.currentRequestId = undefined;
          }
        }
      )
      .addDefaultCase((state, action) => {
        // console.log(`action type ${action.type}`, current(state));
      });
  },
});
export const BlogActions = BlogSlice.actions;
export default BlogSlice.reducer;
