describe('Chức năng đăng nhập', () => {
    it('Đăng nhập với tài khoản hợp lệ', () => {
        cy.visit('http://localhost:3000')

        cy.contains('Đăng Nhập').click()

        cy.get('input[name="email"]').type('nguyenbichngan08092002@gmail.com')
        cy.get('input[name="password"]').type('Ngan892002{enter}')

        cy.url().should('include', '/account').wait(4000)

    })


    it('Đăng nhập với tài khoản không hợp lệ', () => {
        cy.visit('http://localhost:3000')

        cy.contains('Đăng Nhập').click()

        cy.get('input[name="email"]').type('test@gmail.com')
        cy.get('input[name="password"]').type('testabc{enter}')

        cy.contains('Email hoặc mật khẩu không chính xác').should('be.visible')

    })
})