import Koa from 'koa'
import Router from '@koa/router'
import bodyparser from 'koa-bodyparser'

const app = new Koa()
const router = new Router()

router.get('/', async(ctx) => {
  ctx.body = 'hello'
})

router.get('user', '/user/info', async(ctx) => {
  ctx.body = {
    name: '小明',
    age: 18,
    height: 1.88
  }
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

app.use(bodyparser())
app.use(router.routes())

app.listen(3000)
