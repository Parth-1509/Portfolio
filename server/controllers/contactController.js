import { validationResult } from 'express-validator'
import Contact from '../models/Contact.js'
import { sendContactEmail } from '../utils/sendEmail.js'

export const createContact = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() })
  }

  try {
    const { name, email, message } = req.body
    const contact = await Contact.create({ name, email, message })

    try {
      await sendContactEmail({ name, email, message })
    } catch (emailErr) {
      // The message is already saved — don't fail the request just because email didn't send
      console.error('Email sending failed:', emailErr.message)
      return res.status(201).json({
        success: true,
        message: 'Saved, but the email notification failed to send.',
        data: contact,
      })
    }

    return res.status(201).json({ success: true, data: contact })
  } catch (err) {
    console.error('Error creating contact:', err.message)
    return res.status(500).json({ success: false, message: 'Server error. Please try again later.' })
  }
}

export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 })
    return res.status(200).json({ success: true, data: contacts })
  } catch (err) {
    console.error('Error fetching contacts:', err.message)
    return res.status(500).json({ success: false, message: 'Server error. Please try again later.' })
  }
}