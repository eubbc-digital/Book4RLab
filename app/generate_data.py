import json
import uuid

from datetime import date, timedelta

hours = [
    (6, 8),
    (8, 10),
    (10, 12),
    (12, 14),
    (14, 16),
    (16, 18),
    (18, 20),
    (20, 22)
]

laboratories = ['Spectrometry Lab', 'Solar Lab', 'Magnetism Lab']
kits_per_lab = 4

data = []
pk_lab = 1
pk_kit = 1

user = {
    'model': 'core.user',
    'pk': 1,
    'fields': {
        'password': 'pbkdf2_sha256$320000$RR8z0Qcpwjuf6s7XH7TkxM$TjG90WwPi1lOOVpzSI+NhjHwJqMbeW71zIautNnmVFA=',
        'last_login': '2022-03-29T19:34:10Z',
        'is_superuser': True,
        'email': 'test@upb.edu',
        'name': 'Test',
        'last_name': 'UPB',
        'is_active': True,
        'is_staff': True,
        'groups': [],
        'user_permissions': []
    }
}

data.append(user)

for laboratory_name in laboratories:
    laboratory = {
        'model': 'booking.laboratory',
        'pk': pk_lab,
        'fields': {
            'name': laboratory_name,
            'description': laboratory_name
        }
    }

    data.append(laboratory)

    for _ in range(kits_per_lab):
        kit = {
            'model': 'booking.kit',
            'pk': pk_kit,
            'fields': {
                'name': f'Kit {pk_kit % 5}',
                'description': 'Description',
                'laboratory': pk_lab
            }
        }

        pk_kit += 1

        data.append(kit)

    pk_lab += 1

start_year = int(input('Start year: '))
start_month = int(input('Start month: '))
start_day = int(input('Start day: '))

end_year = int(input('End year: '))
end_month = int(input('End month: '))
end_day = int(input('End day: '))

start_date = date(start_year, start_month, start_day) 
end_date = date(end_year, end_month, end_day)

delta = end_date - start_date

pk = 1
total_kits = pk_kit

for i in range(delta.days + 1):
    day = start_date + timedelta(days=i)

    for pk_kit in range(1, total_kits):
        for hour in hours:
            start_hour = hour[0]
            end_hour = hour[1]

            booking = {}
            fields = {}

            booking['model'] = 'booking.booking'
            booking['pk'] = pk

            fields['start_date'] = f'{day}T{start_hour}:00:00Z'
            fields['end_date'] = f'{day}T{end_hour}:00:00Z'
            fields['available'] = True
            fields['public'] = False
            fields['access_id'] = str(uuid.uuid4())
            fields['password'] = 'Password123'
            fields['owner'] = 1
            fields['reserved_by'] = None
            fields['kit'] = pk_kit

            booking['fields'] = fields

            pk = pk + 1

            data.append(booking)


with open('data.json', 'w') as f:
    json.dump(data, f)
