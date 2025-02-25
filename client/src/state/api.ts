import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Product {
  productId: string;
  name: string;
  price: number;
  rating?: number;
  stockQuantity: number;
}

export interface NewProduct { //use Omit<Post, 'productId'> later
  name: string;
  price: number;
  rating?: number;
  stockQuantity: number;
}

export interface NewProduct {
  name: string;
  price: number;
  rating?: number;
  stockQuantity: number;
}

export interface SalesSummary {
  salesSummaryId: string;
  totalValue: number;
  changePercentage?: number;
  date: string;
}

export interface PurchaseSummary {
  purchaseSummaryId: string;
  totalPurchased: number;
  changePercentage?: number;
  date: string;
}

export interface ExpenseSummary {
  expenseSummarId: string;
  totalExpenses: number;
  date: string;
}

export interface ExpenseByCategorySummary {
  expenseByCategorySummaryId: string;
  category: string;
  amount: string;
  date: string;
}

export interface DashboardMetrics {
  popularProducts: Product[];
  salesSummary: SalesSummary[];
  purchaseSummary: PurchaseSummary[];
  expenseSummary: ExpenseSummary[];
  expenseByCategorySummary: ExpenseByCategorySummary[];
}

export interface User {
  userId: string;
  name: string;
  email: string;
}

export const api = createApi({
  //api.reducer is created by createApi
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  reducerPath: "api", // Tên slice này sẽ xuất hiện trong state (state.api)
  tagTypes: ["DashboardMetrics", "Products", "Users"], //tagTypes (khai báo danh sách tag) → Khi khởi tạo API.
  endpoints: (build) => ({
    //build.query<DataType, ArgumentType>
    //DataType: Kiểu dữ liệu mà API sẽ trả về.
    //ArgumentType: Kiểu dữ liệu của tham số truyền vào query
    //DashboardMetrics: API trả về  kieu DashboardMetrics.
    //void: API không yêu cầu tham số đầu vào
    getDashboardMetrics: build.query<DashboardMetrics, void>({
      query: () => "/dashboard",
      providesTags: ["DashboardMetrics"], //providesTags (gán tag cho dữ liệu) → Khi fetch dữ liệu.
    }),

    //Product[]:  API trả về một mảng sản phẩm (Product).
    //string | void:  API có thể nhận tham số kiểu string hoặc không nhận tham số (void).
    getProducts: build.query<Product[], string | void>({
      query: (search) => ({
        url: "/products",
        params: search ? {search} : {}
      }),
      providesTags: ["Products"],
    }),

    createProduct: build.mutation<Product, NewProduct>({ //use Omit<Post, 'productId'> later
      query: (newProduct) => ({
        url: "/products",
        method: "POST",
        body: newProduct
      }),
      invalidatesTags: ["Products"]
    }),

    getUsers: build.query<User[], void>({
      query: () => "/users",
      providesTags: ["Users"],
    }),
  }),
});

export const { 
  useGetDashboardMetricsQuery,
  useGetProductsQuery,
  useCreateProductMutation,
  useGetUsersQuery
} = api;
