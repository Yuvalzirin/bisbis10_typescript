import { Request, Response, Router } from 'express'
import db from '../db/db'
const router = Router()

router.post('/', async (req: Request, res: Response) => {
  const { restaurantId, rating } = req.body
  const restaurant = await db.query('SELECT * FROM restaurant WHERE id = $1', [
    restaurantId,
  ])
  if (restaurant.rows.length === 0) {
    return res.status(404).send('Restaurant not found')
  }
  console.log(req.body)
  await db.query('INSERT INTO rating (restaurantId, rating) VALUES ($1, $2)', [
    restaurantId,
    rating,
  ])
  await db.query(
    'UPDATE restaurant SET avgrating =(SELECT AVG(rating) FROM rating WHERE restaurantId = $1) WHERE id = $1',
    [restaurantId]
  )
  res.sendStatus(200)
})

export default router
