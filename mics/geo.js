
async function getNear() {
    const res = await PartnerService.find(
        {
            'geometry': {
                $geoNear: {
                    $geometry: {
                        type: "Point",
                        coordinates: [80.0521, 23.0958]
                    },
                    $maxDistance: 5000000,
                }
            }
        }
    ).populate('partner service')
}
