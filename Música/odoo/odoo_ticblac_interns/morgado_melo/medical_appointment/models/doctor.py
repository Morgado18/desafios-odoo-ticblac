from odoo import models, fields

class MedicalDoctor(models.Model):
    _name = 'medical.doctor'
    _description = 'Medical Doctor'

    name = fields.Char(string='Name', required=True)
    speciality = fields.Char(string='Speciality')
    phone = fields.Char(string='Phone')
    email = fields.Char(string='Email')
    active = fields.Boolean(string='Active', default=True)
