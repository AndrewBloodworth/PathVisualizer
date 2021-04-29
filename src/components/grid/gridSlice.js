import { createSlice } from '@reduxjs/toolkit';

const gridSlice = createSlice({
    name: 'grid',
    initialState: {
        grid: {
            rows: null,
            cols: null
        }
    },
    reducers: {
        setGrid(state,action) {
            return {
                grid: action.payload
            }
        }
    }
})

//Actions
/////////////////////////////////////////////////////////////
export const { setGrid } = gridSlice.actions;

//Reducer
/////////////////////////////////////////////////////////////
export default gridSlice.reducer;

//Selectors
/////////////////////////////////////////////////////////////
export const selectGrid = (state) => state.grid;