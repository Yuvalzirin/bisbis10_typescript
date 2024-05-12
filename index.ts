import express, { Application } from 'express'
import dotenv from 'dotenv'
import resturantsroutes from './controllers/resturantController'
import orderRoutes from './controllers/orderController'
import ratingRoutes from './controllers/ratingController'
import client from './db/db'

//For env File
dotenv.config()

const app: Application = express()
const port = process.env.PORT || 8000
app.use(express.json())
app.use('/restaurants', resturantsroutes)
app.use('/ratings', ratingRoutes)
app.use('/order', orderRoutes)
app.listen(port, () => {
  console.log(`Server is On at http://localhost:${port}`)
})

process.on('SIGINT', () => {
  client.end((err: Error) => {
    if (err) {
      console.error('error during disconnection', err.stack)
    }
    process.exit()
  })
})

process.on('SIGTERM', () => {
  client.end((err: Error) => {
    if (err) {
      console.error('error during disconnection', err.stack)
    }
    process.exit()
  })
})
