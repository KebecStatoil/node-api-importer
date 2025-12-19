
import * as fs from 'fs'

export const getToken = async () => {

    const { clientId, clientSecret } = JSON.parse(fs.readFileSync('./private/secrets.json'))

    const url = "https://equinorvlinepreprodvh.test02.apimanagement.eu10.hana.ondemand.com:443/v1/oauth2/token";

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Authorization", `Basic ${btoa(clientId + ':' + clientSecret)}`);

    const urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "client_credentials");

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: urlencoded,
        redirect: "follow"
    };

    const response = await fetch(url, requestOptions);
    const result = await response.json();

    const { access_token, expires_in } = result

    return {
        access_token,
        expires_in
    }
}
