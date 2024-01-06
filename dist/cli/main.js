"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const db_1 = require("./db/db");
const validators_1 = require("./validators/validators");
const main = async () => {
    const cli = new commander_1.Command();
    cli
        .version('v1')
        .option('-l, --list', 'List all heros')
        .option('-rm, --remove [value]', 'Delete a hero by id or pass nothing to remove all heroes')
        .option('-up, --update [value]', 'Update a hero by id - use -n and -p to add new values')
        .option('-r, --register', 'Define that you will be registering a hero')
        .option('-n, --name [value]', 'Name of the hero to register')
        .option('-p, --power [value]', 'Power of the hero to register')
        .parse(process.argv);
    const { name, power, id, register, list, remove, update } = cli.opts();
    const db = new db_1.HeroesDB();
    try {
        if (register) {
            const { validName, validPower } = (0, validators_1.nameAndPowerValidator)(name, power);
            const res = await db.createHero({ name: validName, power: validPower, id });
            if (!res) {
                console.error('There was an error registering the Hero');
                return;
            }
            console.log('Hero successfully registered');
            return;
        }
        if (list) {
            const heros = await db.getHeros();
            console.log(heros);
            return;
        }
        if (remove) {
            const id = parseInt(remove);
            const deletedHero = await db.removeHero(id);
            console.log(`It is ${deletedHero} that your hero/heroes have been deleted!`);
            return;
        }
        if (update) {
            const id = parseInt(update);
            const { validName, validPower } = (0, validators_1.nameAndPowerValidator)(name, power);
            const updatedHero = await db.updateHero(id, { name: validName, power: validPower });
            console.log(`It is ${updatedHero} that your hero has been updated!`);
        }
    }
    catch (e) {
        console.log(e);
    }
};
main();
