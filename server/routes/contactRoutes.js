import { Router } from 'express'
import { createContact, getContacts } from '../controllers/contactController.js'
import { validateContact } from '../middleware/validateContact.js'

const router = Router()

// POST /api/contact - submit a new contact message
router.post('/', validateContact, createContact)

// GET /api/contact - list all contact messages (admin use)
router.get('/', getContacts)

export default router