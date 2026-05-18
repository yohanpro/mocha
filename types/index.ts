export type ProductStatus = 'active' | 'sold_out' | 'hidden'
export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'done'

export interface Product {
  id: string
  name: string
  price: number
  stock: number
  image_url: string | null
  status: ProductStatus
  created_at: string
}

export interface Order {
  id: string
  product_id: string
  qty: number
  status: OrderStatus
  created_at: string
}

export interface Customer {
  id: string
  order_id: string
  name: string
  phone: string
  address: string
}

export interface Post {
  id: string
  type: string
  image_url: string | null
  body: string | null
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      products: {
        Row: Product
        Insert: Omit<Product, 'id' | 'created_at'>
        Update: Partial<Omit<Product, 'id' | 'created_at'>>
      }
      orders: {
        Row: Order
        Insert: Omit<Order, 'id' | 'created_at'>
        Update: Partial<Omit<Order, 'id' | 'created_at'>>
      }
      customers: {
        Row: Customer
        Insert: Omit<Customer, 'id'>
        Update: Partial<Omit<Customer, 'id'>>
      }
      posts: {
        Row: Post
        Insert: Omit<Post, 'id' | 'created_at'>
        Update: Partial<Omit<Post, 'id' | 'created_at'>>
      }
    }
  }
}
