import axios from 'axios';
import urls from './urls';
const azureToken = "SharedAccessSignature sr=7ff1172a-048d-4adf-a4c3-a6b018e6432c&sig=lBBQb9mP7bflUXn64IPTqlOJfdVB6jBy07RZKtJtQWc%3D&skn=adminnewtoken16OCT&se=1729077770085";

export const getTranslations = async (lang) => {
    let url = urls.server + urls.lables + lang;
    let response = await axios({
        method: 'GET',
        url: url,
    })
        .then((res) => {
            return {
                code: 200,
                data: res.data,
            }
        })
        .catch((e) => {
            return {
                code: 500,
                msg: e
            }
        });
    return response;
}

export const loadUser = async (id) => {
    let response = await axios({
        method: 'POST',
        data: {
            id: id
        },
        url: urls.server + urls.loadUser
    });
    return response;
};

export const checkUser = async (data) => {
    let response = await axios({
        method: 'POST',
        data: data,
        url: urls.server + urls.checkuser
    });
    return response;
};

export const register = async (data) => {
    let response = await axios({
        method: 'POST',
        url: urls.server + urls.register,
        data: data
    })
        .then((res) => {
            if (res.data.status) {
                return {
                    code: 200,
                    data: res.data,
                }
            } else {
                return {
                    code: 500,
                    msg: res.data.msg,
                }
            }

        })
        .catch((e) => {
            return {
                code: 500,
                msg: e.message,
            }
        });
    return response;
}

export const getBrands = async () => {
    let response = await axios({
        method: 'GET',
        url: urls.server + urls.car_brands,
    })
        .then((res) => {
            return {
                code: 200,
                data: res.data,
            }
        })
        .catch((e) => {
            return {
                code: 500,
                msg: e.message,
            }
        });
    return response;
}


export const addVehicle = async (data) => {
    let response = await axios({
        method: 'POST',
        url: urls.server + urls.save_vehicle,
        data: data
    })
        .then((res) => {
            if (res.data.status) {
                return {
                    code: 200,
                    data: res.data,
                }
            } else {
                return {
                    code: 500,
                    msg: res.data.msg,
                }
            }

        })
        .catch((e) => {
            return {
                code: 500,
                msg: e.message,
            }
        });
    return response;
}
export const getNearByLocations = async (data) => {
    let response = await axios({
        method: 'POST',
        url: urls.server + urls.near_by_locations,
        data: data
    })
        .then((res) => {
            if (res.data.status) {
                return {
                    code: 200,
                    data: res.data,
                }
            } else {
                return {
                    code: 500,
                    msg: res.data.msg,
                }
            }

        })
        .catch((e) => {
            console.log(e);
            return {
                code: 500,
                msg: e.message,
            }
        });
    return response;
}
export const getVehicles = async (data) => {
    let response = await axios({
        method: 'GET',
        url: urls.server + urls.get_vehicles + data,
        data: data
    })
        .then((res) => {
            if (res.data.status) {
                return {
                    code: 200,
                    data: res.data,
                }
            } else {
                return {
                    code: 500,
                    msg: res.data.msg,
                }
            }

        })
        .catch((e) => {
            return {
                code: 500,
                msg: e.message,
            }
        });
    return response;
}
export const getDevices = async (data) => {
    let response = await axios({
        method: 'POST',
        url: urls.server + urls.get_devices,
        data: data
    })
        .then((res) => {
            if (res.data.status) {
                return {
                    code: 200,
                    data: res.data.data,
                }
            } else {
                return {
                    code: 500,
                    msg: res.data.msg,
                }
            }

        })
        .catch((e) => {
            return {
                code: 500,
                msg: e.message,
            }
        });
    return response;
}
export const bookParking = async (data) => {
    let response = await axios({
        method: 'POST',
        url: urls.server + urls.bookParking,
        data: data
    })
        .then((res) => {
            if (res.data.status) {
                return {
                    code: 200,
                    data: res.data,
                }
            } else {
                return {
                    code: 500,
                    msg: res.data.msg,
                }
            }

        })
        .catch((e) => {
            return {
                code: 500,
                msg: e.message,
            }
        });
    return response;
}
export const getCurrentParkings = async (data) => {
    console.log(urls.server + urls.current_parkings + data);
    let response = await axios({
        method: 'GET',
        url: urls.server + urls.current_parkings + data,
    })
        .then((res) => {
            if (res.data.status) {
                return {
                    code: 200,
                    data: res.data,
                }
            } else {
                return {
                    code: 500,
                    msg: res.data.msg,
                }
            }

        })
        .catch((e) => {
            return {
                code: 500,
                msg: e.message,
            }
        });
    return response;
}
export const getParkings = async (data) => {
    let response = await axios({
        method: 'GET',
        url: urls.server + urls.parkings + data,
    })
        .then((res) => {
            if (res.data.status) {
                return {
                    code: 200,
                    data: res.data,
                }
            } else {
                return {
                    code: 500,
                    msg: res.data.msg,
                }
            }

        })
        .catch((e) => {
            return {
                code: 500,
                msg: e.message,
            }
        });
    return response;
}


export const getMyParkingSpots = async (data) => {
    let response = await axios({
        method: 'GET',
        url: urls.server + urls.my_devices + data,
    })
        .then((res) => {
            if (res.data.status) {
                return {
                    code: 200,
                    data: res.data,
                }
            } else {
                return {
                    code: 500,
                    msg: res.data.msg,
                }
            }

        })
        .catch((e) => {
            return {
                code: 500,
                msg: e.message,
            }
        });
    return response;
}

export const getWallet = async (uid) => {
    let response = await axios({
        method: 'GET',
        url: urls.server + urls.get_wallet + uid,
    })
        .then((res) => {
            if (res.data.status) {
                return {
                    code: 200,
                    data: res.data,
                }
            } else {
                return {
                    code: 500,
                    msg: res.data.msg,
                }
            }

        })
        .catch((e) => {
            return {
                code: 500,
                msg: e.message,
            }
        });
    return response;
}

export const sendDeviceCommand = async (device, status) => {
    let response = await axios({
        url: urls.server + urls.device_command,
        method: 'POST',
        data: {
            device_id: device,
            device_status: status,
        },
    })
        .then((res) => {
            if (res.data && res.data.status) {
                return {
                    code: 200,
                    data: res.data,
                }
            } else {
                return {
                    code: 500,
                    msg: (res.data && res.data.msg) || 'Device command failed',
                }
            }
        })
        .catch((e) => {
            return {
                code: 500,
                msg: e.message,
            }
        });
    return response;
}

export const toggleLED = async (device) => {
    return sendDeviceCommand(device, 'light');
}

export const closeParkingBarrier = async (device) => {
    return sendDeviceCommand(device, 'down');
}
export const openParkingBarrier = async (did) => {
    return sendDeviceCommand(did, 'up');
}

export const updateWallet = async (data) => {
    let response = await axios({
        method: 'POST',
        url: urls.server + urls.update_wallet,
        data: data
    })
        .then((res) => {
            if (res.data.status) {
                return {
                    code: 200,
                    data: res.data,
                }
            } else {
                return {
                    code: 500,
                    msg: res.data.msg,
                }
            }

        })
        .catch((e) => {
            return {
                code: 500,
                msg: e.message,
            }
        });
    return response;
}

export const getLatestTransactions = async (uid) => {
    let response = await axios({
        method: 'GET',
        url: urls.server + urls.get_latest_trans + uid,
        data: uid
    });
    return response;
}

export const getAllLocations = async (data) => {
    let response = await axios({
        method: 'POST',
        url: urls.server + urls.get_all_locations,
        data: data,
    });
    return response;
}
export const getPrivateLocations = async (data) => {
    let response = await axios({
        method: 'POST',
        url: urls.server + urls.get_private_locations,
        data: data,
    });
    return response;
}

export const searchLocations = async (data) => {
    let response = await axios({
        method: 'POST',
        url: urls.server + urls.search_locations,
        data: data
    })
        .then((res) => {
            if (res.data.status) {
                return {
                    code: 200,
                    data: res.data,
                }
            } else {
                return {
                    code: 500,
                    msg: res.data.msg,
                }
            }

        })
        .catch((e) => {
            return {
                code: 500,
                msg: e.message,
            }
        });
    return response;
}

export const login = async (data) => {
    let response = await axios({
        method: 'POST',
        url: urls.server + urls.login,
        data: data,
    });
    return response;
}
export const sendResetLink = async (data) => {
    let response = await axios({
        method: 'POST',
        url: urls.server + urls.send_password_reset_link,
        data: data,
    });
    return response;
}

export const getNotifications = async (uid) => {
    let response = await axios({
        method: 'GET',
        url: urls.server + urls.get_notifications + uid,
    });
    return response;
}
export const readNotification = async (id) => {
    let response = await axios({
        method: 'POST',
        url: urls.server + urls.read_notification + id,
    })
        .then((res) => ({ code: 200, data: res.data }))
        .catch((e) => ({ code: 500, msg: e.message }));
    return response;
}
export const deleteNotification = async (id) => {
    let response = await axios({
        method: 'DELETE',
        url: urls.server + urls.delete_notification + id,
    })
        .then((res) => ({ code: 200, data: res.data }))
        .catch((e) => ({ code: 500, msg: e.message }));
    return response;
}
export const resetPassword = async (data) => {
    let response = await axios({
        method: 'POST',
        data: data,
        url: urls.server + urls.reset_password,
    });
    return response;
}
