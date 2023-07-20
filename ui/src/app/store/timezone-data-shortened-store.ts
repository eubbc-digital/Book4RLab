
import { IanaTimezone } from '../interfaces/timezone';
export const iana_timezones = [
    // UTC+14:00
    { group: 'UTC+14:00', timezone: 'Pacific/Kiritimati', label: 'Pacific/Kiritimati (+14)' },
    // UTC+13:00
    { group: 'UTC+13:00', timezone: 'Pacific/Apia', label: 'Pacific/Apia (+13)' },
    { group: 'UTC+13:00', timezone: 'Pacific/Enderbury', label: 'Pacific/Enderbury (+13)' },
    { group: 'UTC+13:00', timezone: 'Pacific/Fakaofo', label: 'Pacific/Fakaofo (+13)' },
    { group: 'UTC+13:00', timezone: 'Pacific/Tongatapu', label: 'Pacific/Tongatapu (+13)' },
    // UTC+12:45
    { group: 'UTC+12:45', timezone: 'Pacific/Chatham', label: 'Pacific/Chatham (+12:45)' },
    // UTC+12:00
    { group: 'UTC+12:00', timezone: 'Antarctica/McMurdo', label: 'Antarctica/McMurdo (NZST)' },
    { group: 'UTC+12:00', timezone: 'Asia/Anadyr', label: 'Asia/Anadyr (+12)' },
    { group: 'UTC+12:00', timezone: 'Pacific/Fiji', label: 'Pacific/Fiji (+12)' },
    { group: 'UTC+12:00', timezone: 'Pacific/Funafuti', label: 'Pacific/Funafuti (+12)' },
    { group: 'UTC+12:00', timezone: 'Pacific/Wallis', label: 'Pacific/Wallis (+12)' },
    // UTC+11:00
    { group: 'UTC+11:00', timezone: 'Antarctica/Casey', label: 'Antarctica/Casey (+11)' },
    { group: 'UTC+11:00', timezone: 'Asia/Magadan', label: 'Asia/Magadan (+11)' },
    { group: 'UTC+11:00', timezone: 'Pacific/Pohnpei', label: 'Pacific/Pohnpei (+11)' },
    // UTC+10:30
    { group: 'UTC+10:30', timezone: 'Australia/Lord_Howe', label: 'Australia/Lord Howe (+10:30)' },
    // UTC+10:00
    { group: 'UTC+10:00', timezone: 'Asia/Ust-Nera', label: 'Asia/Ust-Nera (+10)' },
    { group: 'UTC+10:00', timezone: 'Asia/Vladivostok', label: 'Asia/Vladivostok (+10)' },
    { group: 'UTC+10:00', timezone: 'Australia/Sydney', label: 'Australia/Sydney (AEST)' },
    { group: 'UTC+10:00', timezone: 'Pacific/Saipan', label: 'Pacific/Saipan (ChST)' },
    // UTC+09:30
    { group: 'UTC+09:30', timezone: 'Australia/Broken_Hill', label: 'Australia/Broken Hill (ACST)' },
    { group: 'UTC+09:30', timezone: 'Australia/Darwin', label: 'Australia/Darwin (ACST)' },
    // UTC+09:00
    { group: 'UTC+09:00', timezone: 'Asia/Seoul', label: 'Asia/Seoul (KST)' },
    { group: 'UTC+09:00', timezone: 'Asia/Tokyo', label: 'Asia/Tokyo (JST)' },
    { group: 'UTC+09:00', timezone: 'Pacific/Palau', label: 'Pacific/Palau (+09)' },
    // UTC+08:45
    { group: 'UTC+08:45', timezone: 'Australia/Eucla', label: 'Australia/Eucla (+08:45)' },
    // UTC+08:30
    { group: 'UTC+08:30', timezone: 'Asia/Pyongyang', label: 'Asia/Pyongyang (KST)' },
    // UTC+08:00
    { group: 'UTC+08:00', timezone: 'Asia/Hong_Kong', label: 'Asia/Hong Kong (HKT)' },
    { group: 'UTC+08:00', timezone: 'Asia/Shanghai', label: 'Asia/Shanghai (CST)' },
    { group: 'UTC+08:00', timezone: 'Asia/Singapore', label: 'Asia/Singapore (+08)' },
    { group: 'UTC+08:00', timezone: 'Australia/Perth', label: 'Australia/Perth (AWST)' },
    // UTC+07:00
    { group: 'UTC+07:00', timezone: 'Antarctica/Davis', label: 'Antarctica/Davis (+07)' },
    { group: 'UTC+07:00', timezone: 'Asia/Bangkok', label: 'Asia/Bangkok (+07)' },
    { group: 'UTC+07:00', timezone: 'Asia/Novosibirsk', label: 'Asia/Novosibirsk (+07)' },
    { group: 'UTC+07:00', timezone: 'Asia/Vientiane', label: 'Asia/Vientiane (+07)' },
    { group: 'UTC+07:00', timezone: 'Indian/Christmas', label: 'Indian/Christmas (+07)' },
    // UTC+06:30
    { group: 'UTC+06:30', timezone: 'Asia/Yangon', label: 'Asia/Yangon (+06:30)' },
    { group: 'UTC+06:30', timezone: 'Indian/Cocos', label: 'Indian/Cocos (+06:30)' },
    // UTC+06:00
    { group: 'UTC+06:00', timezone: 'Asia/Almaty', label: 'Asia/Almaty (+06)' },
    { group: 'UTC+06:00', timezone: 'Asia/Bishkek', label: 'Asia/Bishkek (+06)' },
    { group: 'UTC+06:00', timezone: 'Asia/Dhaka', label: 'Asia/Dhaka (+06)' },
    { group: 'UTC+06:00', timezone: 'Indian/Chagos', label: 'Indian/Chagos (+06)' },
    // UTC+05:45
    { group: 'UTC+05:45', timezone: 'Asia/Kathmandu', label: 'Asia/Kathmandu (+05:45)' },
    // UTC+05:30
    { group: 'UTC+05:30', timezone: 'Asia/Colombo', label: 'Asia/Colombo (+05:30)' },
    { group: 'UTC+05:30', timezone: 'Asia/Kolkata', label: 'Asia/Kolkata (IST)' },
    // UTC+05:00
    { group: 'UTC+05:00', timezone: 'Antarctica/Mawson', label: 'Antarctica/Mawson (+05)' },
    { group: 'UTC+05:00', timezone: 'Asia/Dushanbe', label: 'Asia/Dushanbe (+05)' },
    { group: 'UTC+05:00', timezone: 'Asia/Karachi', label: 'Asia/Karachi (PKT)' },
    { group: 'UTC+05:00', timezone: 'Indian/Maldives', label: 'Indian/Maldives (+05)' },
    // UTC+04:30
    { group: 'UTC+04:30', timezone: 'Asia/Kabul', label: 'Asia/Kabul (+04:30)' },
    { group: 'UTC+04:30', timezone: 'Asia/Tehran', label: 'Asia/Tehran (+04:30)' },
    // UTC+04:00
    { group: 'UTC+04:00', timezone: 'Asia/Dubai', label: 'Asia/Dubai (+04)' },
    { group: 'UTC+04:00', timezone: 'Asia/Muscat', label: 'Asia/Muscat (+04)' },
    { group: 'UTC+04:00', timezone: 'Europe/Ulyanovsk', label: 'Europe/Ulyanovsk (+04)' },
    { group: 'UTC+04:00', timezone: 'Indian/Mauritius', label: 'Indian/Mauritius (+04)' },
    { group: 'UTC+04:00', timezone: 'Indian/Reunion', label: 'Indian/Reunion (+04)' },
    // UTC+03:00
    { group: 'UTC+03:00', timezone: 'Africa/Mogadishu', label: 'Africa/Mogadishu (EAT)' },
    { group: 'UTC+03:00', timezone: 'Africa/Nairobi', label: 'Africa/Nairobi (EAT)' },
    { group: 'UTC+03:00', timezone: 'Asia/Jerusalem', label: 'Asia/Jerusalem (IDT)' },
    { group: 'UTC+03:00', timezone: 'Asia/Kuwait', label: 'Asia/Kuwait (+03)' },
    { group: 'UTC+03:00', timezone: 'Asia/Nicosia', label: 'Asia/Nicosia (EEST)' },
    { group: 'UTC+03:00', timezone: 'Asia/Qatar', label: 'Asia/Qatar (+03)' },
    { group: 'UTC+03:00', timezone: 'Europe/Athens', label: 'Europe/Athens (EEST)' },
    { group: 'UTC+03:00', timezone: 'Europe/Bucharest', label: 'Europe/Bucharest (EEST)' },
    { group: 'UTC+03:00', timezone: 'Europe/Moscow', label: 'Europe/Moscow (MSK)' },
    { group: 'UTC+03:00', timezone: 'Europe/Riga', label: 'Europe/Riga (EEST)' },
    { group: 'UTC+03:00', timezone: 'Indian/Comoro', label: 'Indian/Comoro (EAT)' },
    { group: 'UTC+03:00', timezone: 'Indian/Mayotte', label: 'Indian/Mayotte (EAT)' },
    // UTC+02:00
    { group: 'UTC+02:00', timezone: 'Africa/Cairo', label: 'Africa/Cairo (EET)' },
    { group: 'UTC+02:00', timezone: 'Europe/Amsterdam', label: 'Europe/Amsterdam (CEST)' },
    { group: 'UTC+02:00', timezone: 'Europe/Berlin', label: 'Europe/Berlin (CEST)' },
    { group: 'UTC+02:00', timezone: 'Europe/Brussels', label: 'Europe/Brussels (CEST)' },
    { group: 'UTC+02:00', timezone: 'Europe/Budapest', label: 'Europe/Budapest (CEST)' },
    { group: 'UTC+02:00', timezone: 'Europe/Copenhagen', label: 'Europe/Copenhagen (CEST)' },
    { group: 'UTC+02:00', timezone: 'Europe/Luxembourg', label: 'Europe/Luxembourg (CEST)' },
    { group: 'UTC+02:00', timezone: 'Europe/Madrid', label: 'Europe/Madrid (CEST)' },
    { group: 'UTC+02:00', timezone: 'Europe/Malta', label: 'Europe/Malta (CEST)' },
    { group: 'UTC+02:00', timezone: 'Europe/Monaco', label: 'Europe/Monaco (CEST)' },
    { group: 'UTC+02:00', timezone: 'Europe/Oslo', label: 'Europe/Oslo (CEST)' },
    { group: 'UTC+02:00', timezone: 'Europe/Paris', label: 'Europe/Paris (CEST)' },
    { group: 'UTC+02:00', timezone: 'Europe/Rome', label: 'Europe/Rome (CEST)' },
    { group: 'UTC+02:00', timezone: 'Europe/Vienna', label: 'Europe/Vienna (CEST)' },
    // UTC+01:00
    { group: 'UTC+01:00', timezone: 'Africa/Casablanca', label: 'Africa/Casablanca (WEST)' },
    { group: 'UTC+01:00', timezone: 'Africa/Lagos', label: 'Africa/Lagos (WAT)' },
    { group: 'UTC+01:00', timezone: 'Africa/Libreville', label: 'Africa/Libreville (WAT)' },
    { group: 'UTC+01:00', timezone: 'Africa/Porto-Novo', label: 'Africa/Porto-Novo (WAT)' },
    { group: 'UTC+01:00', timezone: 'Atlantic/Canary', label: 'Atlantic/Canary (WEST)' },
    { group: 'UTC+01:00', timezone: 'Europe/Dublin', label: 'Europe/Dublin (IST)' },
    { group: 'UTC+01:00', timezone: 'Europe/London', label: 'Europe/London (BST)' },
    // UTC
    { group: 'UTC', timezone: 'Africa/Dakar', label: 'Africa/Dakar (GMT)' },
    { group: 'UTC', timezone: 'Africa/Monrovia', label: 'Africa/Monrovia (GMT)' },
    { group: 'UTC', timezone: 'Atlantic/St_Helena', label: 'Atlantic/St_Helena (GMT)' },
    // { group: 'UTC', timezone: 'UTC', label: 'UTC (UTC)' },
    // UTC-01:00
    { group: 'UTC-01:00', timezone: 'Atlantic/Cape_Verde', label: 'Atlantic/Cape Verde (-01)' },
    // UTC-02:00
    { group: 'UTC-02:00', timezone: 'America/Miquelon', label: 'America/Miquelon (-02)' },
    { group: 'UTC-02:00', timezone: 'Atlantic/South_Georgia', label: 'Atlantic/South Georgia (-02)' },
    // UTC-02:30
    { group: 'UTC-02:30', timezone: 'America/St_Johns', label: 'America/St Johns (NDT)' },
    // UTC-03:00
    { group: 'UTC-03:00', timezone: 'America/Argentina/Buenos_Aires', label: 'America/Argentina/Buenos Aires (-03)' },
    { group: 'UTC-03:00', timezone: 'America/Bahia', label: 'America/Bahia (-03)' },
    { group: 'UTC-03:00', timezone: 'America/Fortaleza', label: 'America/Fortaleza (-03)' },
    { group: 'UTC-03:00', timezone: 'America/Sao_Paulo', label: 'America/Sao Paulo (-03)' },
    { group: 'UTC-03:00', timezone: 'America/Thule', label: 'America/Thule (ADT)' },
    { group: 'UTC-03:00', timezone: 'Atlantic/Bermuda', label: 'Atlantic/Bermuda (ADT)' },
    { group: 'UTC-03:00', timezone: 'Atlantic/Stanley', label: 'Atlantic/Stanley (-03)' },
    // UTC-04:00
    { group: 'UTC-04:00', timezone: 'America/Aruba', label: 'America/Aruba (AST)' },
    { group: 'UTC-04:00', timezone: 'America/Barbados', label: 'America/Barbados (AST)' },
    { group: 'UTC-04:00', timezone: 'America/Caracas', label: 'America/Caracas (-04)' },
    { group: 'UTC-04:00', timezone: 'America/Curacao', label: 'America/Curacao (AST)' },
    { group: 'UTC-04:00', timezone: 'America/Detroit', label: 'America/Detroit (EDT)' },
    { group: 'UTC-04:00', timezone: 'America/Indiana/Indianapolis', label: 'America/Indiana/Indianapolis (EDT)' },
    { group: 'UTC-04:00', timezone: 'America/Kentucky/Louisville', label: 'America/Kentucky/Louisville (EDT)' },
    { group: 'UTC-04:00', timezone: 'America/La_Paz', label: 'America/La_Paz (-04)' },
    { group: 'UTC-04:00', timezone: 'America/New_York', label: 'America/New_York (EDT)' },
    { group: 'UTC-04:00', timezone: 'America/Puerto_Rico', label: 'America/Puerto Rico (AST)' },
    { group: 'UTC-04:00', timezone: 'America/Santiago', label: 'America/Santiago (-04)' },
    { group: 'UTC-04:00', timezone: 'America/Santo_Domingo', label: 'America/Santo Domingo (AST)' },
    { group: 'UTC-04:00', timezone: 'America/Toronto', label: 'America/Toronto (EDT)' },
    // UTC-05:00
    { group: 'UTC-05:00', timezone: 'America/Bogota', label: 'America/Bogota (-05)' },
    { group: 'UTC-05:00', timezone: 'America/Cancun', label: 'America/Cancun (EST)' },
    { group: 'UTC-05:00', timezone: 'America/Chicago', label: 'America/Chicago (CDT)' },
    { group: 'UTC-05:00', timezone: 'America/Jamaica', label: 'America/Jamaica (EST)' },
    { group: 'UTC-05:00', timezone: 'America/Lima', label: 'America/Lima (-05)' },
    { group: 'UTC-05:00', timezone: 'America/Mexico_City', label: 'America/Mexico City (CDT)' },
    { group: 'UTC-05:00', timezone: 'America/Monterrey', label: 'America/Monterrey (CDT)' },
    { group: 'UTC-05:00', timezone: 'America/North_Dakota/New_Salem', label: 'America/North Dakota/New Salem (CDT)' },
    { group: 'UTC-05:00', timezone: 'America/Panama', label: 'America/Panama (EST)' },
    // UTC-06:00
    { group: 'UTC-06:00', timezone: 'America/Chihuahua', label: 'America/Chihuahua (MDT)' },
    { group: 'UTC-06:00', timezone: 'America/Costa_Rica', label: 'America/Costa Rica (CST)' },
    { group: 'UTC-06:00', timezone: 'America/El_Salvador', label: 'America/El Salvador (CST)' },
    { group: 'UTC-06:00', timezone: 'America/Guatemala', label: 'America/Guatemala (CST)' },
    { group: 'UTC-06:00', timezone: 'Pacific/Galapagos', label: 'Pacific/Galapagos (-06)' },
    // UTC-07:00
    { group: 'UTC-07:00', timezone: 'America/Los_Angeles', label: 'America/Los Angeles (PDT)' },
    { group: 'UTC-07:00', timezone: 'America/Tijuana', label: 'America/Tijuana (PDT)' },
    { group: 'UTC-07:00', timezone: 'America/Vancouver', label: 'America/Vancouver (PDT)' },
    // UTC-08:00
    { group: 'UTC-08:00', timezone: 'America/Nome', label: 'America/Nome (AKDT)' },
    { group: 'UTC-08:00', timezone: 'America/Yakutat', label: 'America/Yakutat (AKDT)' },
    { group: 'UTC-08:00', timezone: 'Pacific/Pitcairn', label: 'Pacific/Pitcairn (-08)' },
    // UTC-09:00
    { group: 'UTC-09:00', timezone: 'America/Adak', label: 'America/Adak (HDT)' },
    { group: 'UTC-09:00', timezone: 'Pacific/Gambier', label: 'Pacific/Gambier (-09)' },
    // UTC-09:30
    { group: 'UTC-09:30', timezone: 'Pacific/Marquesas', label: 'Pacific/Marquesas (-09:30)' },
    // UTC-10:00
    { group: 'UTC-10:00', timezone: 'Pacific/Honolulu', label: 'Pacific/Honolulu (HST)' },
    { group: 'UTC-10:00', timezone: 'Pacific/Tahiti', label: 'Pacific/Tahiti (-10)' },
    // UTC-11:00
    { group: 'UTC-11:00', timezone: 'Pacific/Midway', label: 'Pacific/Midway (SST)' },
    { group: 'UTC-11:00', timezone: 'Pacific/Niue', label: 'Pacific/Niue (-11)' },
    { group: 'UTC-11:00', timezone: 'Pacific/Pago_Pago', label: 'Pacific/Pago Pago (SST)' }
  ] as IanaTimezone[];