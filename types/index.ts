export type ProductStatus = "active" | "sold_out" | "hidden";
export type OrderStatus = "pending" | "confirmed" | "shipped" | "done";

export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  status: ProductStatus;
  created_at: string;
  updated_at: string;
};

export type Order = {
  id: string;
  product_id: string;
  qty: number;
  total_price: number;
  status: OrderStatus;
  created_at: string;
};

export type Customer = {
  id: string;
  order_id: string;
  name: string;
  phone: string;
  address: string;
  memo: string | null;
};

export type PostType = "photo" | "youtube";

export type Post = {
  id: string;
  type: PostType;
  image_url: string | null;
  youtube_url: string | null;
  body: string | null;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      products: {
        Row: Product;
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          price: number;
          stock: number;
          image_url?: string | null;
          status?: ProductStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          price?: number;
          stock?: number;
          image_url?: string | null;
          status?: ProductStatus;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: Order;
        Insert: {
          id?: string;
          product_id: string;
          qty: number;
          total_price: number;
          status?: OrderStatus;
          created_at?: string;
        };
        Update: {
          product_id?: string;
          qty?: number;
          total_price?: number;
          status?: OrderStatus;
          created_at?: string;
        };
        Relationships: [];
      };
      customers: {
        Row: Customer;
        Insert: {
          id?: string;
          order_id: string;
          name: string;
          phone: string;
          address: string;
          memo?: string | null;
        };
        Update: {
          order_id?: string;
          name?: string;
          phone?: string;
          address?: string;
          memo?: string | null;
        };
        Relationships: [];
      };
      posts: {
        Row: Post;
        Insert: {
          id?: string;
          type: PostType;
          image_url?: string | null;
          youtube_url?: string | null;
          body?: string | null;
          created_at?: string;
        };
        Update: {
          type?: PostType;
          image_url?: string | null;
          youtube_url?: string | null;
          body?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
  };
};
