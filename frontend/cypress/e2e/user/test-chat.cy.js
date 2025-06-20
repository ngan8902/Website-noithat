describe('Trang chủ', () => {
    before(() => {
        cy.loginByApi()
    });

    it('Nhắn tin với nhân viên qua ChatBox', () => {
        cy.visit('/')
        // cy.get('[id="zalo-icon"]').should('be.visible').click()
        cy.get('button').find('i.bi-chat').click({ force: true });
        cy.get('input').eq(1).type('Chào Shop!')
        cy.contains('button', "Gửi").click().wait(3000)
    })

    it('Nhắn tin với nhân viên qua Zalo', () => {
        cy.visit('/')
        cy.get('[id="zalo-icon"]').should('be.visible').click()
    })
})





