import { Request, Response } from 'express'
const express = require('express')
import db from '../db/db'
const router = express.Router({ mergeParams: true })

router.put('/:id', (req: Request, res: Response) => {
  const { name, price, description } = req.body
  const dish_id = req.params.id
  if (name) {
    db.query('UPDATE dishes SET name = $1 WHERE id = $2', [name, dish_id])
  }
  if (price) {
    db.query('UPDATE dishes SET price = $1 WHERE id = $2', [price, dish_id])
  }
  if (description) {
    db.query('UPDATE dishes SET description = $1 WHERE id = $2', [
      description,
      dish_id,
    ])
  }
  res.sendStatus(200)
})
router.post('/', async (req: Request, res: Response) => {
  const { name, price, description } = req.body
  const restaurant_id = req.params.id
  await db.query(
    'INSERT INTO dishes (name, price, description, restaurant_id) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, price, description, restaurant_id]
  )
  res.sendStatus(201)
})
router.delete('/:id', async (req: Request, res: Response) => {
  const dish_id = req.params.id
  await db.query('DELETE FROM dishes WHERE id = $1', [dish_id])
  res.sendStatus(204)
})
router.get('/', async (req: Request, res: Response) => {
  const restaurant_id = req.params.id
  const row = await db.query('SELECT * FROM dishes WHERE restaurant_id = $1', [
    restaurant_id,
  ])
  res.status(200).json(row.rows)
})

export default router
