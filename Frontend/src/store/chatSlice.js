import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chats: [],
  currentChat: null,
  messages: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addChat(state, action) {
      const chat = action.payload;
      state.chats = [chat, ...state.chats.filter((item) => item._id !== chat._id)];
    },
    setCurrentChat(state, action) {
      state.currentChat = action.payload;
    },
    setChats(state, action) {
      state.chats = action.payload;
    },
    setMessages(state, action) {
      state.messages = action.payload;
    },
    clearMessages(state) {
      state.messages = [];
    },
    appendMessage(state, action) {
      state.messages.push(action.payload);
    },
  },
});

export const {
  addChat,
  setCurrentChat,
  setChats,
  setMessages,
  clearMessages,
  appendMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
