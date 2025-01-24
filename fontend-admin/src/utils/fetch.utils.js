'use strict'

import axios from "axios"

const instance = axios.create({
    baseURL: 'http://localhost:3000',
    // timeout: 1000,
    headers: {
        'content-type': 'application/json',
        'X-Custom-Header': 'foobar',
        'Accept': "application/json"
    }
});

export default instance