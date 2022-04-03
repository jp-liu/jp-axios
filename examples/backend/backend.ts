import Koa from 'koa'
import Router from '@koa/router'
import bodyparser from 'koa-bodyparser'

const app = new Koa()
const router = new Router()

router.get('/', async(ctx) => {
  ctx.body = 'hello'
})

router.get('user', '/user/info', async(ctx) => {
  const delayTime = +ctx.request.query.delay!
  await ctx.sleep(delayTime)
  // 三秒后返回数据
  ctx.body = {
    name: '小明',
    age: 18,
    height: 1.88
  }
  // await next()
})

router.post('user', '/user/post', async(ctx) => {
  const id = ctx.request.body?.id
  console.log(id === '123321')

  if (id === '123321') {
    ctx.body = true
    return
  }

  ctx.body = false
})

router.post('goods', '/goods/info', async(ctx) => {
  const id = ctx.request.body?.id
  setTimeout(() => {
    if (id === '123321') {
      ctx.body = {
        id: 'easp1212421',
        title: '大棉袄',
        price: 123.11,
        category: ['123', '321', '456'],
      }
    }
  }, 2000)
})

app.context.sleep = function(time: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

app.use(bodyparser())
app.use(router.routes())

app.listen(3000)
