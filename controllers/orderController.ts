import { Request, Response, Router } from 'express'
import db from '../db/db'

const router = Router()

router.post('/', async (req: Request, res: Response) => {
  const orderItems = JSON.stringify(req.body.orderItems)
  const restaurants = await db.query(
    'SELECT * FROM dishes WHERE restaurant_id = $1',
    [req.body.restaurantId]
  )
  const query1 = await db.query('SELECT * FROM restaurant WHERE id = $1 ', [
    req.body.restaurantId,
  ])
  if (query1.rows.length === 0) {
    return res.status(404).json({ message: 'Restaurant not found' })
  }
  const orderItemsArray = req.body.orderItems
  for (let i = 0; i < orderItemsArray.length; i++) {
    const dish = orderItemsArray[i]
    const dishId = dish.dishId
    const dishAvailability = restaurants.rows.find(dish => dish.id === dishId)
    if (!dishAvailability) {
      return res.status(400).json({ message: `Dish is not available` })
    }
  }
  const restaurantId = req.body.restaurantId
  const row = await db.query(
    'INSERT INTO orders (orderItems, restaurantId) VALUES ($1, $2) RETURNING id',
    [orderItems, restaurantId]
  )
  res.status(200).json({ orderId: row.rows[0].id })
})

export default router
