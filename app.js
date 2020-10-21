const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const teamMembers = []
const idArray = []

function appMenu() {

    function createManager() {
        console.log("Please assemble a team");
        inquirer.prompt([
            {
                type: "input",
                name: "managerName",
                message: "What is your name?",
                validate: answer => {
                    if (answer !== "") {
                        return true;
                    }
                    return "Please enter a name";
                }
            },
            {
                type: "input",
                name: "managerId",
                message: "What is Manager's ID?",
                validate: answer => {
                    const pass = answer.match(
                        /^[1-9]\d*$/
                    );
                    if (pass) {
                        return true;
                    }
                    return "You must enter a number greater than zero";
                }
            },
            {
                type: "input",
                name: "managerEmail",
                message: "What is your manager's email?",
                validate: answer => {
                    const pass = answer.match(
                        /\S+@\S+\.\S+/
                    );
                    if (pass) {
                        return true;
                    }
                    return "Please enter a valid email address";
                }
            },
            {
                type: "input",
                name: "officeNumber",
                message: "What is your phone number?",
                validate: answer => {
                    const pass = answer.match(
                        /^[1-9]\d*$/
                    );
                    if (pass) {
                        return true;
                    }
                    return "Please enter a number greater than zero";
                }
            }
        ]).then(answers => {
            const manager = new Manager(answers.ManagerName, answers.managerId, answers.managerEmail, answers.officeNumber);
            teamMembers.push(manager);
            idArray.push(answers.managerId);
            createTeam();
        });
    }

    function createTeam() {

        inquirer.prompt([
            {
                type: "list",
                name: "memberChoice",
                message: "which type of team member would you like to add?",
                choices: [
                    "Engineer",
                    "Intern",
                    "I do not want to add any more members"
                ]
            }
        ]).then(userChoice => {
            switch (userChoice.memberChoice) {
                case "Engineer":
                    addEngineer();
                    break;
                case "Intern":
                    addIntern();
                    break;
                default:
                    buildTeam();
            }
        });
    }

    function addEngineer() {
        inquirer.prompt([
            {
                type: "input",
                name: "engineerName",
                message: "What is your engineer's name?",
                validate: answers => {
                    if (answers !== "") {
                        return true;
                    }
                    return "Please enter a name";
                }
            },
            {
                type: "input",
                name: "engineerId",
                message: "What is the engineer ID?",
                validate: answer => {
                    const pass = answer.match(
                        /^[1-9]\d*$/
                    );
                    if (pass) {
                        if (idArray.includes(answer)) {
                            return "This ID is taken, please choose another";
                        } else {
                            return true;
                        }

                    }
                    return "Enter a number greater than zero";
                }
            },
            {
                type: "input",
                name: "engineerEmail",
                message: "What is your engineer's email address?",
                validate: answer => {
                    const pass = answer.match(
                        /\S+@\S+\.\S+/
                    );
                    if (pass) {
                        return true;
                    }
                    return "Please enter a valid email address";
                }
            },
            {
                type: "INPUT",
                name: "engineerGithub",
                message: "What is your engineer's Github username?",
                validate: answer => {
                    if (answer !== "") {
                        return true;
                    }
                    return "Please enter a username";
                }
            }
        ]).then(answers => {
            const engineer = new Engineer(answers.engineerName, answers.engineerId, answers.engineerEmail, answers.engineerGithub);
            teamMembers.push(engineer);
            idArray.push(answers.engineerId);
            createTeam();
        });
    }

    function addIntern() {
        inquirer.prompt([
            {
                type: "input",
                name: "internName",
                message: "What is the intern's name?",
                validate: answer => {
                    if (answer !== "") {
                        return true;
                    }
                    return "Please enter a name";
                }
            },
            {
                type: "input", name: "internId",
                message: "What is your intern's ID?",
                validate: answer => {
                    const pass = answer.match(
                        /^[1-9]\d*$/
                    );
                    if (pass) {
                        if (idArray.includes(answer)) {
                            return "This ID is taken, please provide another";
                        } else {
                            return true;
                        }

                    }
                    return "Please enter a number greater than zero";
                }
            },
            {
                type: "input",
                name: "internEmail",
                message: "What is your intern's email?",
                validate: answer => {
                    const pass = answer.match(
                        /\S+@\S+\.\S+/
                    );
                    if (pass) {
                        return true;
                    }
                    return "Please enter a valid email address";
                }
            },
            {
                type: "input",
                name: "internSchool",
                message: "What school is your intern from?",
                validate: answer => {
                    if (answer !== "") {
                        return true;
                    }
                    return "Please enter a school";
                }
            }
        ]).then(answers => {
            const intern = new Intern(answers.internName, answers.internId, answers.internEmail, answers.internSchool);
            teamMembers.push(intern);
            idArray.push(answers.internId);
            createTeam();
        });
    }

    function buildTeam() {
        fs.writeFileSync(outputPath, render(teamMembers), "utf-8");
    }

    createManager();

}

appMenu();
