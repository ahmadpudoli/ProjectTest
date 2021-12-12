const baseUrl="http://192.168.8.104:3000";

export const UrlActions = { 
    POST_LOGIN : `${baseUrl}/users/login`,
    POST_PRESENSI_CHECKIN : `${baseUrl}/presensi/checkin`,
    POST_PRESENSI_CHECKOUT : `${baseUrl}/presensi/checkout`,
    GET_INFO_PRESENSI_HARI_INI : `${baseUrl}/presensi/info-presensi-hari-ini`
}