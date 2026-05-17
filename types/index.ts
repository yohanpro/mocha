export type ProductStatus = 'active' | 'sold_out' | 'hidden'
export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'done'

export type Product = {
  id: string
  name: string
  price: number
  stock: number
  image_url: string | null
  status: ProductStatus
  created_at: string
}

export type Order = {
  id: string
  product_id: string
  qty: number
  status: OrderStatus
  created_at: string
}

export type Customer = {
  id: string
  order_id: string
  name: string
  phone: string
  address: string
}

export type Post = {
  id: string
  type: string
  image_url: string | null
  body: string | null
  created_at: string
}
