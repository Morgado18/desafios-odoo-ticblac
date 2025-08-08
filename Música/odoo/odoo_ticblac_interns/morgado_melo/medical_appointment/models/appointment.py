from odoo import models, fields

class MedicalAppointment(models.Model):
    _name = 'medical.appointment'
    _description = 'Medical Appointment'

    patient_id = fields.Many2one('medical.patient', string='Patient', required=True)
    doctor_id = fields.Many2one('medical.doctor', string='Doctor', required=True)
    appointment_date = fields.Date(string='Appointment Date', required=True)
    description = fields.Text(string='Description')
    state = fields.Selection([
        ('draft', 'Draft'),
        ('confirmed', 'Confirmed'),
        ('done', 'Done'),
        ('cancelled', 'Cancelled')
    ], string='State', default='draft', required=True)
