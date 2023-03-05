import { useDispatch } from 'react-redux';
import { configureStore } from "@reduxjs/toolkit";
import SliceStore from "./sliceStore/SliceStore";

const Store = configureStore({
    reducer:{
      blog  : SliceStore
    }
})
export type RootState = ReturnType<typeof Store.getState>
export type AppDispatch = typeof Store.dispatch
export const useAppDispatch =()=> useDispatch<AppDispatch>()
export default Store;