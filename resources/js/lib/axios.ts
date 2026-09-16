import Axios from 'axios';

const axios = Axios.create({
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true, // Required for Sanctum CSRF cookie
});

export default axios;
