import axios from 'axios';

// export const axiosPrivate = axios.create({
//     baseURL: process.env.VUE_APP_BASE_URI,
//     headers: {
//         'X-Requested-With': 'XMLHttpRequest',
//         'X-Authorization': `Bearer ${store.state.auth.token}`,
//     },
// });

export const axiosPublic = axios.create({
    baseURL: process.env.VUE_APP_BASE_URI,
    // baseURL: process.env.VUE_APP_BASE_URI,
    headers: {'X-Requested-With': 'XMLHttpRequest'},
});
