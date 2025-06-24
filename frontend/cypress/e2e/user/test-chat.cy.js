describe('Chức năng nhắn tin đối với khách hàng thành viên', () => {
    before(() => {
        cy.loginByApi()
    });

    it('Nhập tin nhắn ở ChatBox', () => {
        cy.visit('/')
        cy.get('button').find('i.bi-chat').click({ force: true });
        cy.get('input').eq(1).type('Chào Shop!')
        cy.contains('button', "Gửi").click().wait(3000)
    })

    it('Nhắn tin với nhân viên qua Zalo', () => {
        cy.visit('/')
        cy.get('[id="zalo-icon"]').should('be.visible').click().wait(3000)
    })
})

describe('Chức năng nhắn tin đối với khách vãng lai', () => {

    it('Nhập tin nhắn ở ChatBox', () => {
        cy.visit('/')
        cy.get('button').find('i.bi-chat').click({ force: true });

        cy.contains('Bạn cần đăng nhập để chat').click().wait(3000)
    })

    it('Nhắn tin với nhân viên qua Zalo', () => {
        cy.visit('/')
        cy.get('[id="zalo-icon"]').should('be.visible').click()
    })
})





