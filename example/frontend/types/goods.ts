export interface GoodsInfo {
  request: { id: string; name: string; price: number }
  response: {
    id: string
    title: string
    price: number
    category: Category[]
  }
}

type Category = '123' | '321' | '456' | '654'
