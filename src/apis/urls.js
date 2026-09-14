//appcenter codepush release-react -a mohan.velegacherla/ePos-Android -d Production -t 1.0.1
import { Platform } from 'react-native';

// Local backend for testing: smartparkingdashboard Laravel API at :8000.
// Android emulator cannot reach host on 127.0.0.1, it uses 10.0.2.2.
const LOCAL_API_HOST =
    Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://127.0.0.1:8000';

// All APIs online — smartparkingdashboard production
const USE_LOCAL_BACKEND = false;

const PROD_SERVER = 'https://nextgen6th.com/smartparkingdashboard/public/api';
const PROD_HOST = 'https://nextgen6th.com/smartparkingdashboard/public/';

const urls = {
    server: USE_LOCAL_BACKEND ? LOCAL_API_HOST + '/api' : PROD_SERVER,
    host: USE_LOCAL_BACKEND ? LOCAL_API_HOST + '/' : PROD_HOST,
    devices_base_url:'https://nextgen6th.com/',
    lables: '/lables/',
    checkuser: '/check/user',
    loadUser: '/load/user',
    metadata: '/metadata',
    register: '/register',
    login: '/user/login',
    near_by_locations: '/nearby-locations',
    car_brands: '/car-brands',
    save_vehicle: '/save-vehicle',
    get_vehicles: '/vehicles/',
    get_devices: '/devices',
    bookParking: '/book-parking',
    current_parkings: '/current-parkings/',
    parkings: '/parkings/',
    my_devices:'/get-user-devices/',
    get_wallet: '/wallet/',
    search_locations: '/search/locations',
    update_wallet: '/update/wallet',
    get_latest_trans: '/latest/payments/',
    get_all_locations: '/all/locations',
    get_private_locations: '/private/locations',
    send_password_reset_link: '/send/password-reset-link',
    get_notifications: '/get_notifications/',
    delete_notification:'/delete_notification/',
    read_notification:'/read_notification/',
    device_command:'/device-command',
    reset_password:'/reset/password'

}

export default urls;
