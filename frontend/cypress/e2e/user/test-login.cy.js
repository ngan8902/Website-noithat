describe('Chức năng đăng nhập', () => {
    it('Đăng nhập với email + mật khẩu đúng', () => {
        cy.visit('http://localhost:3000')

        cy.contains('Đăng Nhập').click()

        cy.get('input[name="email"]').type('nguyenbichngan08092002@gmail.com')
        cy.get('input[name="password"]').type('Ngan892002{enter}')

        cy.url().should('include', '/account').wait(4000)

    })


    it('Đăng nhập với email đúng + mật khẩu sai', () => {
        cy.visit('http://localhost:3000')

        cy.contains('Đăng Nhập').click()

        cy.get('input[name="email"]').type('nguyenbichngan08092002@gmail.com')
        cy.get('input[name="password"]').type('testabc{enter}')

        cy.contains('Email hoặc mật khẩu không chính xác').should('be.visible').wait(4000)

    })

    it('Bỏ trống email + nhập mật khẩu', () => {
        cy.visit('http://localhost:3000')

        cy.contains('Đăng Nhập').click()

        cy.get('input[name="email"]').type(' ')
        cy.get('input[name="password"]').type('Ngan892002{enter}')

        cy.contains('Vui lòng nhập đầy đủ thông tin').should('be.visible').wait(4000)

    })

    it('Nhập sai định dạng email + nhập mật khẩu', () => {
        cy.visit('http://localhost:3000')

        cy.contains('Đăng Nhập').click()

        cy.get('input[name="email"]').type('nguyen bich ngan08092002@gmail')
        cy.get('input[name="password"]').type('Ngan892002{enter}')

        cy.contains('Sai định dạng email').should('be.visible').wait(4000)

    })

    it('Nhập script JS vào input đầu vào ', () => {
        cy.visit('http://localhost:3000')

        cy.contains('Đăng Nhập').click()

        cy.get('input[name="email"]').type('<script>alert("xss")</script>')
        cy.get('input[name="password"]').type('Ngan892002{enter}')

        cy.contains('Sai định dạng email').should('be.visible').wait(4000)

    })


})