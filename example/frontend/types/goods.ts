export interface GoodsInfo {
  request: { id: string }
  response: {
    id: string
    title: string
    price: number
    category: Category[]
  }
}

type Category = '123' | '321' | '456' | '654'
