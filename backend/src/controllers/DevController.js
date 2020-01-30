const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');

module.exports = {
    // index, show, store, update, destroy

    async store(request, response) {
        const { github_username, techs, latitude, longitude } = request.body;

        let dev = await Dev.findOne({ github_username });

        if (!dev) {
            const apiResponse = await axios
                .get(`https://api.github.com/users/${github_username}`)
                .catch(error => {
                    return response.json({ mensagem: "dev não encontrado no Github!" })
                });

            const { name = login, avatar_url, bio } = apiResponse.data;
            const techsArray = parseStringAsArray(techs);

            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            };

            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location,
            });

            const sendSocketMessageTo = findConnections(
                { latitude, longitude },
                techsArray
            );

            sendMessage(sendSocketMessageTo, 'new-dev', dev)
        }
        return response.json(dev);
    },

    async index(request, response) {
        const devs = await Dev.find();
        return response.json(devs);
    },

    async update(request, response) {
        const { github_username, techs, latitude, longitude } = request.body;

        let dev = await Dev.findOne({ github_username });

        if (!dev) {
            return response.json({ mensagem: "dev não encontrado" });
        }
        const techsArray = parseStringAsArray(techs);

        dev.techs = techsArray;
        dev.latitude = latitude;
        dev.longitude = longitude;

        await Dev.update(dev);

        return response.json(dev);
    },

    async destroy(request, response) {
        const { github_username } = request.body;
        let dev = await Dev.findOne({ github_username });

        if (!dev) {
            return response.json({ mensagem: "dev não encontrado" });
        }

        await Dev.deleteOne(dev);

        return response.json({ mensagem: `Dev ${github_username} is no more!` });
    }
}