import { configureStore }  from '@reduxjs/toolkit';
import gridReducer from '../components/grid/gridSlice';


export const store =  configureStore({
    reducer: {
        grid: gridReducer
    }
})