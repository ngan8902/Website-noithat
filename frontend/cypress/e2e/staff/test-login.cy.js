describe('Chức năng đăng nhập', () => {
    it('Đăng nhập với tài khoản hợp lệ', () => {
        cy.visit('http://localhost:3000/admin/login')


        cy.get('input[name="username"]').type('admin')
        cy.get('input[name="password"]').type('admin{enter}')

        cy.url().should('include', '/dashboard').wait(4000)

    })


    it('Đăng nhập với tài khoản không hợp lệ', () => {
        cy.visit('http://localhost:3000/admin/login')

        cy.get('input[name="username"]').type('test@gmail.com')
        cy.get('input[name="password"]').type('testabc{enter}')

        cy.contains('Tài khoản không đúng!').should('be.visible')

    })
})