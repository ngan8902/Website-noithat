describe('Chức năng chat với khách hàng', () => {
    before(() => {
        cy.loginByApiForStaff();
    })

    it('Vào trang tin nhắn chọn khách hàng để nhắn', () => {
        cy.visit('/admin/chat')

        cy.get('li').eq(0).click()
        cy.get('input[type="text"]').type('Chào Ngân bạn cần tôi hỗ trợ gì không?{enter}')

    })
})