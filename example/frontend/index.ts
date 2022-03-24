import user from './module/user'
import goods from './module/goods'

const modules = {
  user,
  goods
}

user.getUserInfo({ id: '123321123' }).then((res) => {
  if (res.age === 12)
    console.log('123321')
})

goods.getGoodsName({ id: '1313131' }).then((res) => {
  if (res.category.includes('456'))
    console.log(res.price)
})

// type a = keyof typeof modules
// const a: a = 'goods'
// modules.goods.changeGoodsName
export default modules
