import { createSlice } from "@reduxjs/toolkit";

const boardSlice = createSlice({
  name: "board",
  initialState: {
    board: {},
  },
  reducers: {
    setBoard(state, action) {
      return {
        board: action.payload,
      };
    },
    updateGrid(state, action) {
      //this.state.board.grid = action.payload
    },
  },
});

//Actions
/////////////////////////////////////////////////////////////
export const { setBoard, updateGrid } = boardSlice.actions;

//Reducer
/////////////////////////////////////////////////////////////
export default boardSlice.reducer;

//Selectors
/////////////////////////////////////////////////////////////
export const selectBoard = (state) => state.board;
