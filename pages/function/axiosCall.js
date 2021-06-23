import axios from 'axios';

export default async function callService(method, url, data, headers) {
    const response = await axios({
        method,
        headers,
        url,
        data,
    })
        .catch((error) => {
            if (error.response) {
                if (error.response.data.error === undefined || error.response.data.error === '' || error.response.data.error === null) {
                    return 'server error';
                }

                return error.response.data.error;
            } if (error.request) {
                return 'request error';
            }

            return 'has something error';
        });

    return response;
}