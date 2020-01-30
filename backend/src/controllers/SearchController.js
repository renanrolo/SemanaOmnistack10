const Dev = require('../models/Dev')
const parseStringAsArray = require('../utils/parseStringAsArray')

module.exports = {
    async index(request, response) {
        //Buscar todos devs num raio de 10km
        // FIltrar por tecnologias
        const { latitude, longitude, techs } = request.query;
        console.log( "latitude",latitude);
        console.log( "longitude",longitude);
        console.log( "techs",techs);
        const techsArray = parseStringAsArray(techs)

        const devs = await Dev.find({
            techs: {
                $in: techsArray
            },
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude]
                    },
                    $maxDistance: 10000
                }
            }
        });
        console.log("techsArray", techsArray)

        return response.json(devs)
    }
}