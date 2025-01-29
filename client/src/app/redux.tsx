import { useRef } from "react";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
  Provider,
} from "react-redux";
import globalReducer from "@/state";
import { api } from "@/state/api";
import { setupListeners } from "@reduxjs/toolkit/query";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

/* REDUX PERSISTENCE */
// createNoopStorage: Là một phương thức mô phỏng bộ lưu trữ (trả về các giá trị mặc định) khi ứng dụng đang chạy trong môi trường server (ví dụ, khi sử dụng Server-Side Rendering - SSR, nơi không có localStorage).
//createWebStorage("local"): Sử dụng localStorage khi ứng dụng chạy trên trình duyệt, cho phép lưu trữ và truy xuất trạng thái Redux.
const createNoopStorage = () => {
  return {
    getItem(_key: any) {
      return Promise.resolve(null);// Mô phỏng việc truy xuất dữ liệu từ bộ lưu trữ
    },
    setItem(_key: any, value: any) { // Mô phỏng việc lưu dữ liệu vào bộ lưu trữ
      return Promise.resolve(value);
    },
    removeItem(_key: any) { // Mô phỏng việc xóa dữ liệu khỏi bộ lưu trữ
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window === "undefined"
    ? createNoopStorage() //khi o server dung mo phong bo luu tru
    : createWebStorage("local"); // khi o local dung local storage

const persistConfig = {
  key: "root",// Key dùng để xác định trạng thái trong storage(). Trong local storage co key ten la persist:root
  storage,// Sử dụng localStorage để lưu trữ
  whitelist: ["global"],// chỉ có reducer có tên là "global" sẽ được lưu trữ vào trong localStorage và bỏ qua các reducer khác.
};
const rootReducer = combineReducers({
  global: globalReducer, // state global is managed by globalReducer
  [api.reducerPath]: api.reducer, // state api is managed by api.reducer
});

//Root reducer quản lý toàn bộ trạng thái ứng dụng
//persistReducer để tạo một reducer mới có khả năng lưu trữ trạng thái ứng dụng vào localStorage, sessionStorage hoặc AsyncStorage
//persistedReducer được tạo ra sau khi bọc rootReducer bằng persistReducer
// Khi bọc rootReducer bằng persistReducer thêm khả năng lưu trữ cho trạng thái của ứng dụng.
const persistedReducer = persistReducer(persistConfig, rootReducer);

/* REDUX STORE */
export const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(api.middleware),
  });
};

/* REDUX TYPES */
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/* PROVIDER */
export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    storeRef.current = makeStore();
    setupListeners(storeRef.current.dispatch);
  }
  const persistor = persistStore(storeRef.current);

  return (
    <Provider store={storeRef.current}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}