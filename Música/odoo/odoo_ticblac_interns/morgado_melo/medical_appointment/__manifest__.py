{
    'name': 'Medical Appointments',
    'version': '1.0',
    'category': 'Healthcare',
    'summary': 'Módulo para gerenciamento de consultas médicas',
    'description': """
        Este módulo permite gerenciar pacientes e consultas médicas.
    """,
    'author': 'Morgado Melo',
    'depends': ['base'],
    'data': [
        'security/ir.model.access.csv',
        'views/patient_views.xml',
    ],
    'installable': True,
    'application': True,
}
