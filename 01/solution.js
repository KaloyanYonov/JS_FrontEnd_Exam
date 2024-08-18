function manageSuperheroes(input) {
    const numberOfSuperheroes = Number(input.shift());
    const superheroes = {};

    for (let i = 0; i < numberOfSuperheroes; i++) {
        const line = input.shift();
        const firstDashIndex = line.indexOf('-');
        const name = line.substring(0, firstDashIndex);
        const powersAndEnergy = line.substring(firstDashIndex + 1);
        const lastDashIndex = powersAndEnergy.lastIndexOf('-');
        const powers = powersAndEnergy.substring(0, lastDashIndex);
        const energy = parseInt(powersAndEnergy.substring(lastDashIndex + 1));

        superheroes[name] = {
            superpowers: powers.split(','),
            energy: energy
        };
    }

    const actions = {
        "Use Power": (name, power, energyRequired) => {
            energyRequired = Number(energyRequired);
            if (superheroes[name] && superheroes[name].superpowers.includes(power) && superheroes[name].energy >= energyRequired) {
                superheroes[name].energy -= energyRequired;
                console.log(`${name} has used ${power} and now has ${superheroes[name].energy} energy!`);
            } else {
                console.log(`${name} is unable to use ${power} or lacks energy!`);
            }
        },
        "Train": (name, energyGained) => {
            energyGained = Number(energyGained);
            if (superheroes[name] && superheroes[name].energy < 100) {
                const originalEnergy = superheroes[name].energy;
                superheroes[name].energy = Math.min(100, superheroes[name].energy + energyGained);
                console.log(`${name} has trained and gained ${superheroes[name].energy - originalEnergy} energy!`);
            } else {
                console.log(`${name} is already at full energy!`);
            }
        },
        "Learn": (name, newPower) => {
            if (superheroes[name] && superheroes[name].superpowers.includes(newPower)) {
                console.log(`${name} already knows ${newPower}.`);
            } else if (superheroes[name]) {
                superheroes[name].superpowers.push(newPower);
                console.log(`${name} has learned ${newPower}!`);
            }
        }
    };

    let command = input.shift();
    while (command && command !== 'Evil Defeated!') {
        const [action, name, ...args] = command.split(' * ');
        if (actions[action]) {
            actions[action](name, ...args);
        }
        command = input.shift();
    }

    Object.keys(superheroes)
        .sort() 
        .forEach(name => {
            console.log(`Superhero: ${name}`);
            console.log(` - Superpowers: ${superheroes[name].superpowers.join(', ')}`);
            console.log(` - Energy: ${superheroes[name].energy}`);
        });
}
