var planets = {
    sun: {
        radius: .01,
        distance: 0,
        speed: .0001,
        asset: "assets/2k_sun.jpg",
        light: true,
        moons: {

            mercury: {
                radius: 0.4,
                distance: 4,
                speed: 0.9,
                asset: "assets/2k_mercury.jpg"
            },

            venus: {
                radius: 1.2,
                distance: 7,
                speed: 0.6,
                asset: "assets/2k_venus.jpg"
            },

            earth: {
                radius: 1.2,
                distance: 15,
                speed: 0.4,
                asset: "./assets/2k_earth.jpg",
                moons: {
                    moon: {
                        radius: .3,
                        speed: .1,
                        distance: 4,
                        asset: "assets/2k_moon.jpg"
                    }
                }
            },

            mars: {
                radius: .7,
                distance: 25,
                speed: 0.1,
                asset: "assets/2k_mars.jpg",
                moons: {
                    phobos: {
                        radius: .1,
                        distance: 1.4,
                        speed: 0.8,
                        asset: "assets/2k_phobos.jpg"
                    }
                }
            },
            jupiter: {
                radius: 7,
                distance: 52,
                speed: 0.01,
                asset: "assets/2k_jupiter.jpg",
            },
            saturn: {
                radius: 6,
                distance: 96,
                speed: 0.001,
                asset: "assets/2k_saturn.jpg",
            },
            uranus: {
                radius: 2.5,
                distance: 192,
                speed: 0.0001,
                asset: "assets/2k_uranus.jpg",
            },
            netptune: {
                radius: 2.5,
                distance: 300,
                speed: 0.00001,
                asset: "assets/2k_neptune.jpg",
            }

        }
    }
}

var asteroids = {
    main1: {
        lower: 32,
        upper: 45,
        number: 40,
        speed: .1
    },
    main2: {
        lower: 32,
        upper: 45,
        number: 40,
        speed: .2
    },
    main3: {
        lower: 32,
        upper: 45,
        number: 40,
        speed: .3
    },
    kuiper: {
        lower: 120,
        upper: 160,
        number: 50,
        speed: .01
    },
    kuiper2: {
        lower: 120,
        upper: 160,
        number: 50,
        speed: .1
    }
}