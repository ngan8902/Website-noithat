const TOKEN_KEY = 'token';
const STAFF_TOKEN_KEY = 'staff-token'

Cypress.Commands.add("loginByApi", () => {
    cy.request("POST", "http://localhost:8000/api/user/sign-in", {
        email: "nguyenbichngan08092002@gmail.com",
        password: "Ngan892002"
    }).then((response) => {
        const token = response.body.access_token;
        cy.setCookie(TOKEN_KEY, token);
    });
});

Cypress.Commands.add("loginByApiForStaff", () => {
    cy.request("POST", "http://localhost:8000/api/staff/sign-in", {
        username: "admin",
        password: "admin"
    }).then((response) => {
        const token = response.body.access_token;
        cy.setCookie(STAFF_TOKEN_KEY, token);
    });
});

