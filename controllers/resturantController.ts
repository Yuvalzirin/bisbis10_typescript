import { Request, Response, Router } from 'express'
import dishRoutes from './dishesController'
import db from '../db/db'

const router = Router()

router.get('/', async (req, res) => {
  const cuisine: any = req.query.cuisine
  if (cuisine) {
    const raw = await db.query(
      'SELECT * FROM restaurant WHERE $1 = ANY(cuisines)',
      [cuisine]
    )
    res.status(200).json(raw.rows)
  } else {
    const raw = await db.query('SELECT * FROM restaurant')
    res.status(200).json(raw.rows)
  }
})

router.get('/:id', async (req, res) => {
  const id = req.params.id
  const query1 = await db.query('SELECT * FROM restaurant WHERE id = $1 ', [id])
  const query2 = await db.query(
    'SELECT * FROM dishes WHERE restaurant_id = $1',
    [id]
  )
  //checks if the restaurant exists
  if (query1.rows.length === 0) {
    return res.status(404).json({ message: 'Restaurant not found' })
  }
  res.status(200).json({
    ...query1.rows[0],
    dishes: query2.rows,
  })
})

router.post('/', async (req: Request, res: Response) => {
  console.log(req.body)
  const { name, isKosher, cuisines } = req.body
  await db.query(
    'INSERT INTO restaurant (name, avgrating, isKosher, cuisines) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, 0.0, isKosher, cuisines]
  )
  res.sendStatus(201)
})
router.put('/:id', async (req: Request, res: Response) => {
  const id = req.params.id
  if (req.body.name) {
    await db.query(
      'UPDATE restaurant SET name = $1 WHERE id = $2 RETURNING *',
      [req.body.name, id]
    )
  }
  if (req.body.isKosher) {
    await db.query(
      'UPDATE restaurant SET isKosher = $1 WHERE id = $2 RETURNING *',
      [req.body.isKosher, id]
    )
  }
  if (req.body.cuisines) {
    await db.query(
      'UPDATE restaurant SET cuisines = $1 WHERE id = $2 RETURNING *',
      [req.body.cuisines, id]
    )
  }
  res.sendStatus(200)
})

router.delete('/:id', async (req: Request, res: Response) => {
  const id = req.params.id
  await db.query('DELETE FROM dishes WHERE restaurant_id = $1', [id])
  await db.query('DELETE FROM rating WHERE restaurantId = $1', [id])
  await db.query('DELETE FROM orders WHERE restaurantId = $1', [id])
  await db.query('DELETE FROM restaurant WHERE id = $1', [id])
  res.sendStatus(204)
})

router.use('/:id/dishes', dishRoutes)

export default router
