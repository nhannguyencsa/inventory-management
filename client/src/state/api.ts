import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";

export const api = createApi({ //api.reducer is created by createApi
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL}),
  reducerPath: 'api',// Tên slice này sẽ xuất hiện trong state (state.api)
  tagTypes: [],
  endpoints: (build) => ({}),
});

export const {} = api;