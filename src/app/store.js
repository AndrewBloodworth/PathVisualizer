import { configureStore }  from '@reduxjs/toolkit';
import boardReducer from '../components/grid/boardSlice';


export const store =  configureStore({
    reducer: {
        board: boardReducer
    }
})